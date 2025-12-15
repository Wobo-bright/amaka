# src/bot_logic_offline.py
import numpy as np
import faiss
import os
from pathlib import Path
from dotenv import load_dotenv

# Try to import Groq; set a flag if unavailable
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

def load_groq_key(dotenv_path=None):
    """
    Load GROQ_API_KEY from a .env file or environment variables.
    """
    if dotenv_path:
        load_dotenv(dotenv_path=dotenv_path)
    return os.getenv("GROQ_API_KEY")

def build_faiss_index(df, embedding_col='embedding'):
    embeddings = np.stack(df[embedding_col].values)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index

def ask_bot_offline(query, df, model, index, top_k=5, dotenv_path=None):
    # Normalize column names
    df.columns = [c.lower().strip() for c in df.columns]
    name_col = next((c for c in df.columns if 'name' in c), None)
    desc_col = next((c for c in df.columns if 'desc' in c), None)
    price_col = next((c for c in df.columns if 'price' in c), None)

    if not all([name_col, desc_col, price_col]):
        raise ValueError("Inventory.xlsx must contain Name, Description, and Price columns.")

    # Search FAISS for top-k relevant items
    query_emb = model.encode(query).reshape(1, -1)
    distances, indices = index.search(query_emb, top_k)

    # Prepare context as natural sentences
    context_sentences = [
        f"We have {df.iloc[i][name_col]} ({df.iloc[i][desc_col]}) for ${df.iloc[i][price_col]}"
        for i in indices[0]
    ]
    context = "\n".join(context_sentences)

    # Use Groq if available and API key is found
    if HAS_GROQ:
        api_key = load_groq_key(dotenv_path)
        if api_key:
            client = Groq(api_key=api_key)
            prompt = f"""
You are a friendly and helpful store assistant. The customer asked: '{query}'
Based on the inventory below, answer naturally and politely. 
Mention only relevant items with their name, description, and price. 
Speak like a real salesperson helping the customer:

{context}
"""
            try:
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    max_tokens=600,
                    temperature=0.75,
                )
                return chat_completion.choices[0].message.content.strip()
            except Exception:
                # fallback if Groq fails
                return context

    # fallback if Groq is not available
    return context

# src/bot_logic_offline.py
import numpy as np
import faiss
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Try to import Groq; set a flag if unavailable
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False
    print("Groq not installed, will use offline mode only.")

# --- Memory setup ---
MEMORY_FILE = r"C:\Users\HP\Desktop\meta-hackathon\chat_memory.json"
if Path(MEMORY_FILE).exists():
    with open(MEMORY_FILE, "r") as f:
        chat_memory = json.load(f)
else:
    chat_memory = []  # List of {"user": ..., "ai": ...}

def save_memory():
    with open(MEMORY_FILE, "w") as f:
        json.dump(chat_memory, f, indent=2)

# --- Loader for API key ---
def loader(path: str):
    """Load the GROQ_API_KEY from a .env file and return it."""
    load_dotenv(path)
    return os.getenv("GROQ_API_KEY")

# --- FAISS ---
def build_faiss_index(df, embedding_col='embedding'):
    embeddings = np.stack(df[embedding_col].values)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index

# --- Bot with memory ---
def ask_bot_offline(query, df, model, index, top_k=5, dotenv_path=r"C:\Users\HP\Desktop\meta-hackathon\.env"):
    # Normalize column names
    df.columns = [c.lower().strip() for c in df.columns]
    name_col = next((c for c in df.columns if 'name' in c), None)
    desc_col = next((c for c in df.columns if 'desc' in c), None)
    price_col = next((c for c in df.columns if 'price' in c), None)

    if not all([name_col, desc_col, price_col]):
        raise ValueError("Inventory.xlsx must contain Name, Description, and Price columns.")

    # FAISS top-k search
    query_emb = model.encode(query).reshape(1, -1)
    distances, indices = index.search(query_emb, top_k)

    context_sentences = [
        f"{df.iloc[i][name_col]} ({df.iloc[i][desc_col]}) - ${df.iloc[i][price_col]}"
        for i in indices[0]
    ]
    context = "\n".join(context_sentences)

    # Include memory in the prompt (last 5 exchanges)
    memory_context = "\n".join(
        [f"User: {m['user']}\nAI: {m['ai']}" for m in chat_memory[-5:]]
    )

    # Load Groq API key
    api_key = loader(r"C:\Users\HP\Desktop\meta-hackathon\rag_bot\.env")
    print("Loaded GROQ_API_KEY:", api_key)

    # Attempt Groq API if available
    if HAS_GROQ and api_key:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""
{memory_context}
A customer asked: '{query}'
Please respond in a friendly and helpful way, just like a real salesperson. 
Refer only to items from the inventory below, mentioning their name, description, and price.
Keep your tone polite and engaging:


{context}
"""
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                max_tokens=600,
                temperature=0.75,
            )
            answer = response.choices[0].message.content.strip()
            chat_memory.append({"user": query, "ai": answer})
            save_memory()
            return answer
        except Exception as e:
            print("Groq API call failed:", e)
            print("Falling back to offline response.")

    # Offline fallback using FAISS context
    if context_sentences:
        answer = "Here are items from our inventory matching your query:\n" + context
        chat_memory.append({"user": query, "ai": answer})
        save_memory()
        return answer
    else:
        answer = "Sorry, no relevant items found in inventory."
        chat_memory.append({"user": query, "ai": answer})
        save_memory()
        return answer

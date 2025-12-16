import numpy as np
import faiss
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# --------------------------------------------------
# Path setup (root-relative, HTML-equivalent)
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent   # rag_bot/src
ROOT_DIR = BASE_DIR.parent                  # rag_bot

MEMORY_FILE = ROOT_DIR / "chat_memory.json"
ENV_FILE = ROOT_DIR / ".env"

# --------------------------------------------------
# Try to import Groq
# --------------------------------------------------
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False
    print("Groq not installed, will use offline mode only.")

# --------------------------------------------------
# Memory setup
# --------------------------------------------------
if MEMORY_FILE.exists():
    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        chat_memory = json.load(f)
else:
    chat_memory = []

def save_memory():
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(chat_memory, f, indent=2)

# --------------------------------------------------
# Loader for API key
# --------------------------------------------------
def loader(env_path: Path):
    load_dotenv(env_path)
    return os.getenv("GROQ_API_KEY")

# --------------------------------------------------
# FAISS
# --------------------------------------------------
def build_faiss_index(df, embedding_col="embedding"):
    embeddings = np.stack(df[embedding_col].values)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index

# --------------------------------------------------
# Bot with memory
# --------------------------------------------------
def ask_bot(query, df, model, index, top_k=5):
    df.columns = [c.lower().strip() for c in df.columns]
    name_col = next((c for c in df.columns if "name" in c), None)
    desc_col = next((c for c in df.columns if "desc" in c), None)
    price_col = next((c for c in df.columns if "price" in c), None)

    if not all([name_col, desc_col, price_col]):
        raise ValueError("Inventory must contain Name, Description, and Price columns.")

    # FAISS search
    query_emb = model.encode(query).reshape(1, -1)
    distances, indices = index.search(query_emb, top_k)

    context_sentences = [
        f"{df.iloc[i][name_col]} ({df.iloc[i][desc_col]}) - ${df.iloc[i][price_col]}"
        for i in indices[0]
    ]
    context = "\n".join(context_sentences)

    # Memory context
    memory_context = "\n".join(
        [f"User: {m['user']}\nAI: {m['ai']}" for m in chat_memory[-5:]]
    )

    # Load API key
    api_key = loader(ENV_FILE)

    # Online mode
    if HAS_GROQ and api_key:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""
{memory_context}
A customer asked: '{query}'
Respond naturally and politely like a real salesperson.
Mention only relevant inventory items with name, description, and price.

Inventory:
{context}
"""
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                max_tokens=600,
                temperature=0.5,
            )
            answer = response.choices[0].message.content.strip()
            chat_memory.append({"user": query, "ai": answer})
            save_memory()
            return answer
        except Exception as e:
            print("Groq API failed:", e)

    # Offline fallback
    if context_sentences:
        answer = "Here are matching items:\n" + context
    else:
        answer = "Sorry, no relevant items found."

    chat_memory.append({"user": query, "ai": answer})
    save_memory()
    return answer

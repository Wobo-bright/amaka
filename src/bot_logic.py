# src/bot_logic_offline.py
import numpy as np
import faiss
import os
import json
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
from sentence_transformers import SentenceTransformer

# Try to import Groq; set a flag if unavailable
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False
    print("Groq not installed, will use offline mode only.")


BASE_DIR = Path(__file__).resolve().parent.parent
MEMORY_FILE = BASE_DIR / "chat_memory.json"
ENV_PATH = BASE_DIR / ".env"
DATA_PATH = BASE_DIR / "data" / "inventory.xlsx"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
_RESOURCE_CACHE = None

if MEMORY_FILE.exists():
    with open(MEMORY_FILE, "r") as f:
        chat_memory = json.load(f)
else:
    chat_memory = []  # List of {"user": ..., "ai": ...}


def save_memory():
    try:
        MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(MEMORY_FILE, "w") as f:
            json.dump(chat_memory, f, indent=2)
    except OSError as exc:
        print(f"Unable to write chat history to {MEMORY_FILE}: {exc}")


def loader(path: Path = ENV_PATH):
    """Load the GROQ_API_KEY from a .env file and return it."""
    load_dotenv(path)
    return os.getenv("GROQ_API_KEY")


def build_faiss_index(df, embedding_col='embedding'):
    embeddings = np.stack(df[embedding_col].values)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index


def prepare_resources(data_path: Path = DATA_PATH, model_name: str = MODEL_NAME):
    """
    Load inventory data, compute embeddings if missing, and build a FAISS index.
    Resources are cached so they are only prepared once per process.
    """
    global _RESOURCE_CACHE
    if _RESOURCE_CACHE is not None:
        return _RESOURCE_CACHE

    df = pd.read_excel(data_path)
    df.columns = [c.lower().strip() for c in df.columns]

    desc_col = next((c for c in df.columns if 'desc' in c), None)
    if desc_col is None:
        raise ValueError("Inventory.xlsx must contain a Description column.")

    model = SentenceTransformer(model_name)
    if "embedding" not in df.columns:
        df["embedding"] = df[desc_col].apply(lambda x: model.encode(x))

    index = build_faiss_index(df)
    _RESOURCE_CACHE = (df, model, index)
    return _RESOURCE_CACHE


def ask_bot_offline(query, df, model, index, top_k=5, dotenv_path: Path = ENV_PATH):
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
    api_key = loader(dotenv_path)

    # Attempt Groq API if available
    if HAS_GROQ and api_key:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""
{memory_context}
A customer asked: {query}
Respond naturally, politely, and in a friendly, helpful salesperson tone, using Nigerian context and phrasing where appropriate.
Mention only relevant items from the inventory, including their name, brief description, and price.
Keep the response concise (maximum two sentences).
If product details are unclear or context is lacking, search the internet for clarification, but do not introduce or reference items outside the inventory.

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

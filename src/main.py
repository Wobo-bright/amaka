# src/main_offline.py
import pandas as pd
from sentence_transformers import SentenceTransformer
from bot_logic import build_faiss_index, ask_bot_offline

# Load your dataset (with precomputed embeddings or compute embeddings here)
df = pd.read_excel("data/inventory.xlsx")

# Initialize embedding model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Compute embeddings if not already in df
if 'embedding' not in df.columns:
    df['embedding'] = df['Description'].apply(lambda x: model.encode(x))

# Build FAISS index
index = build_faiss_index(df)

# Ask queries offline
while True:
    query = input("Ask a question (or 'exit'): ")
    if query.lower() == "exit":
        break
    answer = ask_bot_offline(query, df, model, index)
    print(f"Answer:\n{answer}\n")
76 
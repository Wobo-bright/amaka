# src/load_data.py
import pandas as pd
from sentence_transformers import SentenceTransformer

def load_inventory(path="data/inventory.xlsx"):
    df = pd.read_excel(path)
    df.columns = [c.lower().replace(" ", "_") for c in df.columns]
    required = {"name", "description"}
    if not required.issubset(set(df.columns)):
        raise ValueError(f"Excel must contain columns: {required}")
    return df

def embed_inventory(df):
    model = SentenceTransformer("all-MiniLM-L6-v2")
    df['embedding'] = df['description'].apply(lambda x: model.encode(x))
    return df, model

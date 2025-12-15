import numpy as np
from embedder import get_embedding

def build_vector_store(df):
    vectors = []

    for _, row in df.iterrows():
        embedding = get_embedding(row["details"])
        vectors.append({
            "embedding": np.array(embedding, dtype="float32"),
            "metadata": {
                "item": row["item"],
                "details": row["details"]
            }
        })

    return vectors

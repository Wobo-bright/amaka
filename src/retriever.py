import numpy as np

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve_relevant(query, vector_store, top_k=5, get_embedding=None):
    """
    query: str, user question
    vector_store: list of dicts with 'embedding' and 'metadata'
    top_k: number of items to retrieve
    get_embedding: function to get embeddings (pass from embedder)
    """
    if get_embedding is None:
        raise ValueError("get_embedding function must be passed")

    query_vec = np.array(get_embedding(query), dtype="float32")

    similarities = []
    for item in vector_store:
        score = cosine_similarity(query_vec, item["embedding"])
        similarities.append((score, item["metadata"]))

    similarities.sort(key=lambda x: x[0], reverse=True)
    top_items = [meta for _, meta in similarities[:top_k]]
    return top_items

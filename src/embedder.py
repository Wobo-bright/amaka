import numpy as np
from config import client

def get_embedding(text: str) -> np.ndarray:
    response = client.embeddings.create(
        model="llama-embed-1",
        input=text
    )
    return np.array(response.data[0].embedding, dtype="float32")

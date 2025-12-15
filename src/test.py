from config import client

resp = client(
    model="llama-3.3-70b-versatile",
    input="Hello world"
)

print(resp.data[0].embedding[:10])  # prints first 10 numbers of embedding

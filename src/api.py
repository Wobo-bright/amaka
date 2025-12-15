from fastapi import FastAPI
from pydantic import BaseModel
from src.bot_logic import ask_bot_offline

app = FastAPI(title="RAG Inventory API")

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@app.post("/query", response_model=QueryResponse)
def query_inventory(request: QueryRequest):
    answer = ask_bot_offline(request.query)
    return {"answer": answer}

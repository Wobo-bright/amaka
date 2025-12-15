from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.bot_logic import ask_bot_offline, prepare_resources

app = FastAPI(title="RAG Inventory API")

df, model, index = prepare_resources()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@app.post("/query", response_model=QueryResponse)
def query_inventory(request: QueryRequest):
    try:
        answer = ask_bot_offline(request.query, df, model, index)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return {"answer": answer}

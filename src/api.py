from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse


app = Flask(__name__)

# You can choose to remove this function as well.
@app.route('/')
def helloworld():
    return "Hello world"

def main():
    print("Bot is running...")
    app.run(debug=True)



@app.route('/whatsapp', methods=['POST'])
def whatsapp_reply():
    #Fetch the message
    incoming_msg = request.values.get('Body', '').lower()
    print(incoming_msg)
    
    #Create reply
    resp = MessagingResponse()
    #msg = resp.message()
    if "hello" in incoming_msg:
        resp.message(f"Hello to you too")
        print(resp)

    return str(resp)


if __name__ == '__main__':
    main()



"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.bot_logic import ask_bot_offline, prepare_resources
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse

app = FastAPI(title="RAG Inventory API")

df, model, index = prepare_resources()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@app.post("/query", response_model=QueryResponse)
def query_inventory(request: QueryRequest):
    incoming_msg = request.values.get('Body', '').lower()
    resp = MessagingResponse()
    msg = resp.message()
    Chat_history = []

    try:
        answer = ask_bot_offline(request.query, df, model, index)
        msg.body(answer)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
        #msg.body(answer)
    return {"answer": answer}
"""
import argparse
from bot_logic import ask_bot_offline, prepare_resources
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)


# You can choose to remove this function as well.
@app.route('/')
def helloworld():
    return "How are you doing"


def interactive_loop(incoming_msg, df, model, index):
    while True:
        try:
            #query = input("Ask a question (or 'exit'): ")
            #incoming_msg = request

            #if query is None:
            if incoming_msg is None:
                break

            incoming_msg = incoming_msg.strip()
            if incoming_msg == "exit":
                break
            if not incoming_msg:
                print("Please enter a question or type 'exit' to quit.")
                continue

            
            answer = ask_bot_offline(incoming_msg, df, model, index)
            return answer

        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break
        #print(f"Answer:\n{answer}\n")

def main():
    print("Bot is running...")
    app.run(host='0.0.0.0', port=8000, debug=True)



def business_owner():
    print("Here the human is talking")
    incoming_msg = request.form.get('Body', '')
    print("Incoming:", incoming_msg)

    input = ("The input from the frontend")

    #answer = ask_bot_offline(incoming_msg, df, model, index)

    resp = MessagingResponse()
    resp.message(input)

    return str(resp), 200


df, model, index = prepare_resources()

def bot_reply():
    incoming_msg = request.form.get('Body', '')
    print("Incoming:", incoming_msg)

    answer = ask_bot_offline(incoming_msg, df, model, index)

    resp = MessagingResponse()
    resp.message(answer)

    return str(resp), 200

@app.route('/whatsapp', methods=['POST'])
def whatsapp_reply():
    #There will be a form of trigger from the toggle, then that    
    
    print("Here the bot is t")


"""
@app.route('/whatsapp', methods=['POST'])
def whatsapp_reply():
    #Fetch the message
    incoming_msg = request.form.get('Body', '').lower()
    print(incoming_msg)
    
    parser = argparse.ArgumentParser(description="Inventory RAG bot")
    parser.add_argument("--incoming_msg", help="Run a single query in non-interactive mode")
    args = parser.parse_args()


    answer = ""
    if args.incoming_msg:
        answer += ask_bot_offline(args.incoming_msg, df, model, index)
        #print(f"Answer:\n{answer}\n")
        #return

    #Create reply
    resp = MessagingResponse()

    #final_answer = interactive_loop(incoming_msg, df, model, index)#This is the final output
    #print(request.form)
    resp.message(answer)
    print(resp)
    return str(resp), 200

"""

if __name__ == "__main__":
    main()
# src/main_offline.py
import pandas as pd
from sentence_transformers import SentenceTransformer
from bot_logic import build_faiss_index, ask_bot

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
    answer = ask_bot(query, df, model, index)
    print(f"Answer:\n{answer}\n")
76 

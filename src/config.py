import os
from dotenv import load_dotenv
from groq import Groq

# load .env from project root
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError("GROQ_API_KEY not set")

client = Groq(api_key=api_key)

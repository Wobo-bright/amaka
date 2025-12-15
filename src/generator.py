from config import client  # your Groq client initialized with GROQ_API_KEY

def generate_answer(query, relevant_items):
    """
    query: user question
    relevant_items: list of dicts with 'item' and 'details'
    """
    context_text = "\n".join([item["details"] for item in relevant_items])

    prompt = f"""
You are a helpful assistant for a supermarket. 
Given the following inventory information:
{context_text}

Answer the question: {query}
Respond concisely.
"""

    # Groq text generation
    response = client.generate(
        model="llama2-7b",  # adjust to your model
        input=prompt,
        max_output_tokens=200
    )

    return response.output_text  # or the correct field from Groq response

import os
from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

userInput = input("Question: ")

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role":"system",
            "content":"you are an expert on food caloric contents."
        },
        {
            "role": "user",
            "content": userInput,
        }
    ],
    model="llama3-8b-8192",
    max_completion_tokens=1024,
)

print(chat_completion.choices[0].message.content)
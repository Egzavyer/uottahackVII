import os
from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role":"system",
            "content":"you are an expert on food caloric contents."
        },
        {
            "role": "user",
            "content": "How many calories are in a motts Fruitsations Assorted Fruits gummy bag small snack 22.6g",
        }
    ],
    model="llama-3.3-70b-versatile",
    max_completion_tokens=1024,
)

print(chat_completion.choices[0].message.content)
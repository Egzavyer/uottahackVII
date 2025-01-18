import os
from groq import Groq


class DescriptionProcessing:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "llama-3.1-8b-instant"
        self.systemPrompt = "Take the description of foods and their portion sized and estimate the calories in the meal. Output only a single line and follow this exact format, the name of the meal followed by a colon followed by the estimated calorie count of the entire meal."


        self.userPrompt = "do not output anything"



    def approximateCalories(self, imageDescription):
        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": self.systemPrompt},
                {
                    "role": "user",
                    "content": self.userPrompt + imageDescription,
                },
            ],
            model=self.model,
        )

        return chat_completion.choices[0].message.content

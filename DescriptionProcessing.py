import os
from groq import Groq


class DescriptionProcessing:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "llama-3.1-8b-instant"
        self.systemPrompt = "Take the description of foods with their portion sizes and estimate the number of calories in the entire meal. The output will be only a single line that will follow this exact format, the name of the meal followed by a colon followed by the estimated calorie count of the meal. If you give a breakdown of items you fail the task. If give more than what is specified you fail the task."


        self.userPrompt = "do not output anything"



    def approximateCalories(self, description):
        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": self.systemPrompt},
                {
                    "role": "user",
                    "content": self.userPrompt + description,
                },
            ],
            model=self.model,
        )

        return chat_completion.choices[0].message.content

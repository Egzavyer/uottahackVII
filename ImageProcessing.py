import os
import base64
from groq import Groq


class ImageProcessing:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "llama-3.2-11b-vision-preview"
        self.prompt = "Analyse this image with the goal of describing the food. You must name all foods and their portions. List the types of food, the portion size, the way the food is prepared for each food. Include all visible food items, even if they appear in the background or partially obscured."
    
    def encodeImage(self, filepath):
        with open(filepath, "rb") as image:
            return base64.b64encode(image.read()).decode("utf-8")

    def imageToText(self, base64Image):
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": self.prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64Image}"
                            },
                        },
                    ],
                },
            ],
            model=self.model,
            max_completion_tokens=512,
        )

        return chat_completion.choices[0].message.content

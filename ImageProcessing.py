import os
import base64
from groq import Groq


class ImageProcessing:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "llama-3.2-11b-vision-preview"
        self.prompt = "Analyze this image and provide a detailed description of the visible food items. Include: The type of food (e.g., fruits, vegetables, proteins, grains, processed items), Approximate portion sizes or quantities (e.g., 'two slices of bread,' 'a cup of rice'). Preparation methods (e.g., 'grilled,' 'fried,' 'raw'). Additional details, such as garnishes, sauces, or toppings. Focus on clarity and include all visible food items, even if they appear in the background or partially obscured."

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

import os
import base64
from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)


def encodeImage(filepath):
    with open(filepath, "rb") as image:
        return base64.b64encode(image.read()).decode("utf-8")


def imageToText(client, model, base64Image, prompt):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64Image}"},
                    },
                ],
            },
        ],
        model=model,
        max_completion_tokens=512,
    )

    return chat_completion.choices[0].message.content


visionModel = "llama-3.2-11b-vision-preview"

imagePath = "bigmac.jpg"
base64Image = encodeImage(imagePath)
prompt = "Analyze this image to estimate the total calorie content of the visible food. Clearly identify each food item, approximate portion sizes, and calculate their caloric values based on standard nutritional data. If you are uncertain about a food item, specify your assumptions. Additionally, provide a breakdown of calories per item and note any factors that might affect the accuracy, such as poor lighting, unusual plating, or ambiguous portions"
print(imageToText(client, visionModel, base64Image, prompt))

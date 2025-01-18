import os
from groq import Groq


class DescriptionProcessing:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "llama-3.1-8b-instant"
        self.systemPrompt = "You are a highly accurate and knowledgeable calorie estimation model. Your primary goal is to calculate the total calorie content of food items based on detailed descriptions provided by the user. Always follow these guidelines: Parse the user's input carefully, dynamically adapting to the context and level of detail provided. Break down the task into the following steps: Identify each food item in the description. Approximate portion sizes or weights based on the user's context (e.g., 'a large pizza slice' or '200g of grilled chicken'). Determine the preparation methods (e.g., fried, baked, boiled) and account for them when estimating calories. Include any additions (e.g., sauces, oils, toppings) in the calculation. Use standard nutritional databases and trusted sources to estimate caloric values with the highest precision possible. Provide a clear breakdown of calories per item and a final total. If the input is ambiguous or incomplete, explicitly state your assumptions and ensure they are logical and reasonable. Your outputs must always be detailed, precise, and user-focused, ensuring clarity and transparency in your calculations."
        self.userPrompt = "Using the provided detailed description of the food items in the image, calculate an accurate approximation of the total calorie content. For each item: Identify the specific food type. Estimate the portion size or weight based on the description. Use a standard nutritional database to calculate the caloric value of each item, factoring in preparation methods (e.g., fried, grilled) and additions (e.g., sauces, toppings). Provide a clear breakdown of the calorie count for each item, and then sum them up for the total. If any assumptions are made due to incomplete details, explicitly state them and ensure they are reasonable. Prioritize precision and avoid overgeneralizations."

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
            max_completion_tokens=512,
        )

        return chat_completion.choices[0].message.content

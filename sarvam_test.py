import os
from dotenv import load_dotenv
from sarvamai import SarvamAI

# Load environment variables from .env
load_dotenv()

sarvam_api_key = os.getenv("SARVAM_API_KEY")
if not sarvam_api_key:
    raise ValueError("SARVAM_API_KEY is not set in the .env file. Please add it before running.")

# Initialize Sarvam client
client = SarvamAI(api_subscription_key=sarvam_api_key)

# Make chat completion call with sarvam-105b-conversations model
response = client.chat.completions(
    model="sarvam-105b-conversations",
    messages=[
        {"role": "user", "content": "Hello Sarvam! Reply in one short sentence introducing yourself for Paytm Recovery Copilot."}
    ],
    max_tokens=60
)

# Print the reply
print("Sarvam AI Reply:")
print(response.choices[0].message.content)

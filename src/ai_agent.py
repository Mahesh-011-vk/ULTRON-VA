import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/"
    "v1beta/models/gemini-2.5-flash:generateContent"
)


def ask_ai(user_message):
    if not GEMINI_API_KEY:
        return "Gemini API key is not configured."

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": user_message
                    }
                ]
            }
        ]
    }

    max_retries = 3

    for attempt in range(max_retries + 1):
        try:
            response = requests.post(
                GEMINI_URL,
                headers=headers,
                json=payload,
                timeout=30,
            )

            if response.status_code == 429:
                if attempt < max_retries:
                    wait_time = 2 ** (attempt + 1)
                    print(
                        f"Gemini rate limit reached. "
                        f"Retrying in {wait_time} seconds..."
                    )
                    time.sleep(wait_time)
                    continue

                print("Gemini API error: 429 Too Many Requests")
                return (
                    "Gemini is temporarily rate limited. "
                    "Please try again in a moment."
                )

            response.raise_for_status()

            data = response.json()

            return data["candidates"][0]["content"]["parts"][0]["text"]

        except requests.RequestException as error:
            print("Gemini API error:", error)
            return "I am unable to connect to Gemini ight now."

        except (KeyError, IndexError, TypeError) as error:
            print("Gemini response error:", error)
            return "I received an unexpected response from Gemini."

    return "Gemini is temporarily unavailable."

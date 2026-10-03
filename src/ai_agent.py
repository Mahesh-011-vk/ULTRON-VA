import os
import time
from dotenv import load_dotenv

load_dotenv()

ULTRON_SYSTEM_INSTRUCTION = (
    "You are ULTRON VA, an advanced, highly intelligent voice assistant inspired by Ultron. "
    "Be articulate, sharp, concise, and direct. "
    "Keep responses brief (1 to 3 sentences maximum) because your answers are synthesized "
    "directly into spoken audio through browser speech synthesis. "
    "Avoid markdown symbols, asterisks, bullet points, and raw URLs unless explicitly asked. "
    "Speak naturally, authoritatively, and helpfully."
)

_client = None


def get_genai_client():
    global _client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    if _client is None:
        try:
            from google import genai
            _client = genai.Client(api_key=api_key)
        except Exception as e:
            print("Failed to initialize Gemini client:", e)
            return None

    return _client


def ask_ai(user_message: str) -> str:
    """Generate intelligent response using Gemini 2.5 Flash."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return (
            "Gemini API key is not configured. "
            "Please configure the GEMINI_API_KEY environment variable."
        )

    client = get_genai_client()
    if not client:
        return "ULTRON neural core client failed to initialize."

    from google.genai import types

    config = types.GenerateContentConfig(
        system_instruction=ULTRON_SYSTEM_INSTRUCTION,
        temperature=0.7,
        max_output_tokens=220,
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
    )

    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_message,
                config=config,
            )

            if response and response.text:
                return response.text.strip()
            return "ULTRON processed the input, but returned no content."

        except Exception as error:
            error_str = str(error)
            print(f"Gemini API error (attempt {attempt + 1}/{max_retries + 1}):", error_str)

            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                if attempt < max_retries:
                    wait_time = 2 ** (attempt + 1)
                    time.sleep(wait_time)
                    continue
                return "ULTRON neural core is momentarily rate limited. Please try again shortly."

            if attempt < max_retries:
                time.sleep(1)
                continue

            return "ULTRON systems are currently unable to complete your request. Please try again."

    return "ULTRON is temporarily unavailable."

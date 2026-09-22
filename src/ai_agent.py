import ollama


def ask_ai(user_message):
    response = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful personal voice assistant. "
                    "Give short, clear and natural answers suitable for speech."
                ),
            },
            {
                "role": "user",
                "content": user_message,
            },
        ],
    )

    return response["message"]["content"]
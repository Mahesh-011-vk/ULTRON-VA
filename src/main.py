import speech_recognition as sr

from tts import speak
from commands import process_command
from ai_agent import ask_ai


def listen():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source, duration=1)

        try:
            audio = recognizer.listen(
                source,
                timeout=5,
                phrase_time_limit=8
            )
        except sr.WaitTimeoutError:
            print("Assistant: I didn't hear anything.")
            return None

    try:
        text = recognizer.recognize_google(audio)
        print(f"You: {text}")
        return text

    except sr.UnknownValueError:
        print("Assistant: Sorry, I didn't understand.")
        return None

    except sr.RequestError:
        print("Assistant: Speech recognition service is unavailable.")
        return None


def main():
    speak("Hello! I am your advanced voice assistant. How can I help you?")

    while True:
        command = listen()

        if command is None:
            continue

        response, should_exit = process_command(command)

        # If it is not a built-in command,
        # send it to our local Llama AI.
        if response.startswith("You said"):
            print("Assistant: Thinking...")
            response = ask_ai(command)

        print(f"Assistant: {response}")
        speak(response)

        if should_exit:
            break


if __name__ == "__main__":
    main()
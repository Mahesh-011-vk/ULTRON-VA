import speech_recognition as sr


recognizer = sr.Recognizer()

print("Starting microphone test...")

print("Available microphones:")

microphones = sr.Microphone.list_microphone_names()

for index, name in enumerate(microphones):
    print(index, name)


print("\nStarting microphone...")

with sr.Microphone() as source:

    print("Adjusting for background noise...")
    recognizer.adjust_for_ambient_noise(source, duration=1)

    print("Listening now...")

    audio = recognizer.listen(
        source,
        timeout=10,
        phrase_time_limit=10
    )

print("Audio captured!")


try:

    print("Converting speech to text...")

    text = recognizer.recognize_google(audio)

    print("\nYou said:")
    print(text)


except sr.UnknownValueError:

    print("Sorry, I couldn't understand your voice.")


except sr.RequestError as error:

    print("Speech recognition service error:")
    print(error)
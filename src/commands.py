from datetime import datetime
import webbrowser
from weather import get_weather

def process_command(command):
    command = command.lower().strip()

    # Time
    if "time" in command:
        current_time = datetime.now().strftime("%I:%M %p")
        return f"The current time is {current_time}", False

    # Date
    if "date" in command or "today" in command:
        current_date = datetime.now().strftime("%A, %B %d, %Y")
        return f"Today is {current_date}", False

    # Open YouTube
    if "open youtube" in command:
        webbrowser.open("https://www.youtube.com")
        return "Opening YouTube.", False

    # Open Google
    if "open google" in command:
        webbrowser.open("https://www.google.com")
        return "Opening Google.", False

    # Open GitHub
    if "open github" in command:
        webbrowser.open("https://github.com")
        return "Opening GitHub.", False

    # Exit
    if any(word in command for word in ["exit", "stop", "close", "quit", "goodbye"]):
        return "Goodbye Mahesh!", True

    # Unknown command → AI
    return f"You said {command}", False
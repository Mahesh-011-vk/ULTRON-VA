import requests


def get_weather(city):
    url = f"https://wttr.in/{city}?format=j1"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        current = data["current_condition"][0]

        temperature = current["temp_C"]
        feels_like = current["FeelsLikeC"]
        humidity = current["humidity"]
        description = current["weatherDesc"][0]["value"]

        return (
            f"The weather in {city} is {description}. "
            f"The temperature is {temperature} degrees Celsius, "
            f"feels like {feels_like} degrees, "
            f"with {humidity} percent humidity."
        )

    except Exception:
        return f"Sorry, I could not get the weather for {city}."
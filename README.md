# ULTRON VA

ULTRON VA is an AI-powered voice assistant built with Python, Flask, browser speech technologies, and local Llama 3.2 AI.

It combines voice interaction, AI conversations, web commands, weather information, and a futuristic Ultron-inspired 3D interface.

## Features

- 🎙️ Voice input using browser Speech Recognition
- 🔊 Voice responses using browser Speech Synthesis
- 🤖 Local Llama 3.2 AI through Ollama
- 🌐 Flask backend API
- 🌤️ Weather information
- 🕒 Time and date commands
- ▶️ Open YouTube
- 🔎 Open Google
- 💻 Open GitHub
- 🎨 Futuristic Ultron-inspired interface
- ⚡ Quick action buttons
- 🔴 Animated assistant status
- 🧠 AI fallback for general questions

## Architecture

```text
                    ULTRON VA
                        │
                        ▼
              ┌─────────────────┐
              │   Web Interface │
              │ HTML/CSS/JS     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Flask Backend  │
              │    REST API     │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
      ┌───────────────┐  ┌───────────────┐
      │   Commands    │  │   Local AI    │
      │ Time/Weather  │  │ Ollama        │
      │ Web Actions   │  │ Llama 3.2     │      
      └───────────────┘  └───────────────┘

PROJECT STRUCTURE
ULTRON-VA/
│
├── config/
│   └── commands.json
│
├── src/
│   ├── ai_agent.py
│   ├── commands.py
│   ├── email_agent.py
│   ├── intents.py
│   ├── knowledge.py
│   ├── main.py
│   ├── reminder.py
│   ├── server.py
│   ├── speech.py
│   ├── tts.py
│   └── weather.py
│
├── web/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── assets/
│       └── ultron.jpg
│
├── test_ai.py
├── requirements.txt
├── .gitignore
└── README.md

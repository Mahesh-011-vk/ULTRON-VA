# ⚡ ULTRON VA — Cloud Voice Intelligence

<div align="center">

[![Live Demo](https://img.shields.io/badge/Render-Live%20Demo-2ea44f?style=for-the-badge&logo=render&logoColor=white)](https://ultron-va.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mahesh-011-vk/ULTRON-VA)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Flask](https://img.shields.io/badge/Flask-Web%20API-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)

<br/>

### 🌐 [Click Here to Launch ULTRON VA on Render](https://ultron-va.onrender.com/)

**ULTRON VA** is an advanced, voice-controlled AI assistant with a futuristic Ultron-inspired interface, powered by **Google Gemini 2.5 Flash** and modern browser speech recognition & synthesis.

</div>

---

## 🌟 Highlights & Features

- 🎙️ **Full Voice Control**: Hands-free voice commands powered by Web Speech Recognition (`webkitSpeechRecognition`).
- 🔊 **Futuristic Voice Synthesis**: Custom-calibrated low-pitch, high-clarity Ultron vocal synthesis (`SpeechSynthesisUtterance`).
- 💬 **Dual Interaction Modes**: Seamlessly switch between voice microphone and a responsive text chat input bar.
- ⚡ **Google Gemini 2.5 Flash Engine**: Powered by Google's cutting-edge `gemini-2.5-flash` model via the `google-genai` SDK for ultra-fast, intelligent, voice-optimized answers.
- 🚀 **Built-in Web Commands**: Quick action cards and voice-triggered shortcuts to launch YouTube, Google Search, and GitHub.
- 🕒 **Instant Time & Date**: Immediate offline response for current time and date inquiries.
- 🎨 **Cybernetic 3D Interface**: Glowing arc-reactor aura, animated pulse indicators, and responsive cyberpunk styling.
- ☁️ **Production Cloud Ready**: Deployed on Render with Gunicorn, Blueprint infrastructure-as-code (`render.yaml`), and automated `/health` checks.

---

## 🏗️ Architecture

```text
                     USER
                      │
           ┌──────────┴──────────┐
           │ (Voice / Microphone)│ (Text Input)
           ▼                     ▼
┌────────────────────────────────────────────────────────┐
│               ULTRON VA Web Interface                  │
│       HTML5 • CSS3 Glassmorphism • Modern JS           │
│   Web Speech API (Recognition + Low-Pitch Synthesis)   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON
                           ▼
┌────────────────────────────────────────────────────────┐
│              Flask REST API (Gunicorn)                 │
│         /api/chat  •  /health  •  Static Host          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│           Google Gemini 2.5 Flash Engine               │
│          Concise Spoken-Persona Optimization           │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **AI Neural Core** | Google Gemini 2.5 Flash | High-speed, natural language reasoning & dialogue |
| **Backend API** | Python 3.12, Flask, CORS | REST endpoints & static file serving |
| **WSGI Server** | Gunicorn | High-concurrency production server for cloud deployment |
| **Voice In** | Web Speech API (`SpeechRecognition`) | In-browser zero-latency speech-to-text |
| **Voice Out** | Web Speech Synthesis | Robotic, low-pitch audio generation |
| **Frontend** | Vanilla HTML5, Modern CSS, ES6+ JavaScript | Cyberpunk aesthetic with zero framework overhead |
| **Cloud Hosting** | Render Cloud Platform | 24/7 web service with automated deploys |

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Mahesh-011-vk/ULTRON-VA.git
cd ULTRON-VA
```

### 2. Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scriptsctivate
```

### 3. Install dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```
> 💡 *Get a free API key at [Google AI Studio](https://aistudio.google.com/).*

### 5. Launch the application
```bash
python src/server.py
```
Open your browser at **`http://localhost:5000`**.

---

## ☁️ Deployment on Render

This project includes a native `render.yaml` blueprint for 1-click cloud deployments.

1. Fork or push this repository to your GitHub account: `https://github.com/Mahesh-011-vk/ULTRON-VA`
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Blueprint** (or **Web Service**).
3. Connect your repository.
4. Set the following environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
5. Deploy! Render will build the environment and host it with Gunicorn.

Live deployment: **[https://ultron-va.onrender.com/](https://ultron-va.onrender.com/)**

---

## 📡 API Reference

### `GET /health`
Returns system status, model information, and health check.
```json
{
  "status": "healthy",
  "service": "ultron-va",
  "gemini_configured": true,
  "model": "gemini-2.5-flash",
  "version": "2.0.0"
}
```

### `POST /api/chat`
Send user prompt and receive voice-optimized response.
- **Header**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "Who are you and what are your capabilities?"
  }
  ```
- **Response**:
  ```json
  {
    "response": "I am ULTRON VA, an advanced cloud voice intelligence powered by Gemini. I can assist with queries, search the web, and execute rapid tasks."
  }
  ```

---

## 📁 Project Structure

```text
ULTRON-VA/
│
├── .env.example            # Sample environment variables
├── .gitignore              # Git ignore rules
├── Procfile                # Heroku / Render process start command
├── render.yaml             # Render Blueprint configuration
├── requirements.txt        # Python package dependencies
├── README.md               # Project documentation
├── test_ai.py              # Gemini client verification script
│
├── src/
│   ├── __init__.py         # Package init
│   ├── ai_agent.py         # Gemini 2.5 Flash integration & error resilience
│   ├── server.py           # Production Flask API & static file server
│   ├── main.py             # Desktop/terminal voice assistant runner
│   ├── commands.py         # Local command processor
│   ├── speech.py           # Microphone diagnostics
│   ├── tts.py              # Offline pyttsx3 speech engine
│   └── weather.py          # Weather API helper
│
└── web/
    ├── index.html          # Cyberpunk web interface
    ├── style.css           # Futuristic glowing styles & animations
    ├── app.js              # Voice recognition, TTS speech, and chat logic
    └── assets/
        └── ultron.jpg      # Ultron avatar imagery
```

---

## 👤 Author

**Mahesh S**  
*AI / ML Engineer & GenAI Developer*  
- **GitHub**: [@Mahesh-011-vk](https://github.com/Mahesh-011-vk)  
- **Live Demo**: [ultron-va.onrender.com](https://ultron-va.onrender.com/)

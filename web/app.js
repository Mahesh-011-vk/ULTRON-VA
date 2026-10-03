const statusText = document.getElementById("statusText");
const ultronContainer = document.getElementById("ultronContainer");
const micButton = document.getElementById("micButton");
const stopVoiceButton = document.getElementById("stopVoiceButton");

const homeNav = document.getElementById("homeNav");
const chatNav = document.getElementById("chatNav");

const chatPanel = document.getElementById("chatPanel");
const conversation = document.getElementById("conversation");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

let recognition = null;
let isListening = false;
let voiceWasStopped = false;


/* =========================================================
   NAVIGATION
   ========================================================= */

homeNav?.addEventListener("click", () => {
    homeNav.classList.add("active");
    chatNav?.classList.remove("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


chatNav?.addEventListener("click", () => {
    chatNav.classList.add("active");
    homeNav?.classList.remove("active");

    chatPanel?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    chatInput?.focus();
});


/* =========================================================
   MESSAGE DISPLAY
   ========================================================= */

function addMessage(sender, text, type) {
    if (!conversation) {
        return;
    }

    const message = document.createElement("div");
    message.className = `message ${type}`;

    message.innerHTML = `
        <div class="message-content">
            <strong>${escapeHtml(sender)}</strong>
            <p>${escapeHtml(text)}</p>
        </div>
    `;

    conversation.appendChild(message);
    conversation.scrollTop = conversation.scrollHeight;
}


function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


/* =========================================================
   VOICE SELECTION & SYNTHESIS
   ========================================================= */

function getUltronVoice() {
    if (!("speechSynthesis" in window)) {
        return null;
    }

    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
        return null;
    }

    const preferredVoiceNames = [
        "Alex",
        "Daniel",
        "Fred",
        "Google UK English Male",
        "Google US English",
        "Microsoft David",
        "Microsoft Mark"
    ];

    for (const preferredName of preferredVoiceNames) {
        const voice = voices.find(item => item.name.includes(preferredName));
        if (voice) {
            return voice;
        }
    }

    return (
        voices.find(v => v.lang.startsWith("en") && /male|david|daniel|alex|fred|mark/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith("en")) ||
        voices[0]
    );
}


function speak(text) {
    if (!("speechSynthesis" in window)) {
        if (statusText) statusText.textContent = "Speech synthesis unavailable";
        return;
    }

    try {
        window.speechSynthesis.cancel();
    } catch (e) {}

    voiceWasStopped = false;

    const speech = new SpeechSynthesisUtterance(text);
    const voice = getUltronVoice();

    if (voice) {
        speech.voice = voice;
        speech.lang = voice.lang || "en-US";
    } else {
        speech.lang = "en-US";
    }

    // Ultron characteristic deep, crisp tone
    speech.rate = 0.85;
    speech.pitch = 0.50;
    speech.volume = 1.0;

    speech.onstart = () => {
        if (statusText) statusText.textContent = "ULTRON is speaking...";
        ultronContainer?.classList.add("speaking");
    };

    speech.onend = () => {
        ultronContainer?.classList.remove("speaking");
        if (!voiceWasStopped && statusText) {
            statusText.textContent = "Ready when you are";
        }
    };

    speech.onerror = error => {
        console.error("ULTRON speech error:", error);
        ultronContainer?.classList.remove("speaking");
        if (!voiceWasStopped && statusText) {
            statusText.textContent = "Ready when you are";
        }
    };

    window.speechSynthesis.speak(speech);
}


/* =========================================================
   STOP VOICE
   ========================================================= */

stopVoiceButton?.addEventListener("click", () => {
    if ("speechSynthesis" in window) {
        voiceWasStopped = true;
        window.speechSynthesis.cancel();
    }
    ultronContainer?.classList.remove("speaking");
    if (statusText) statusText.textContent = "Voice stopped";
});


/* =========================================================
   SEND MESSAGE / COMMAND DISPATCH
   ========================================================= */

async function sendMessage(message) {
    if (!message || !message.trim()) {
        return;
    }

    const cleanMessage = message.trim();
    const lowerMessage = cleanMessage.toLowerCase();

    addMessage("YOU", cleanMessage, "user");

    // Local quick command handling
    if (lowerMessage === "open youtube" || lowerMessage.includes("open youtube")) {
        window.open("https://www.youtube.com", "_blank", "noopener,noreferrer");
        const reply = "Opening YouTube for you.";
        addMessage("ULTRON VA", reply, "assistant");
        speak(reply);
        return;
    }

    if (lowerMessage === "open google" || lowerMessage.includes("open google")) {
        window.open("https://www.google.com", "_blank", "noopener,noreferrer");
        const reply = "Opening Google Search.";
        addMessage("ULTRON VA", reply, "assistant");
        speak(reply);
        return;
    }

    if (lowerMessage === "open github" || lowerMessage.includes("open github")) {
        window.open("https://github.com/Mahesh-011-vk/ULTRON-VA", "_blank", "noopener,noreferrer");
        const reply = "Opening the ULTRON VA GitHub repository.";
        addMessage("ULTRON VA", reply, "assistant");
        speak(reply);
        return;
    }

    if (lowerMessage === "what time is it" || lowerMessage === "time" || lowerMessage.includes("current time")) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const reply = `The current time is ${timeStr}.`;
        addMessage("ULTRON VA", reply, "assistant");
        speak(reply);
        return;
    }

    if (lowerMessage === "what is the date" || lowerMessage === "date" || lowerMessage.includes("today's date")) {
        const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const reply = `Today is ${dateStr}.`;
        addMessage("ULTRON VA", reply, "assistant");
        speak(reply);
        return;
    }

    if (statusText) statusText.textContent = "ULTRON is thinking...";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: cleanMessage
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        const answer = data.response || "I received an empty response.";

        addMessage("ULTRON VA", answer, "assistant");
        speak(answer);

    } catch (error) {
        console.error("Backend error:", error);
        const errorMessage = "Sorry. I could not connect to the ULTRON neural core.";
        addMessage("ULTRON VA", errorMessage, "assistant");
        if (statusText) statusText.textContent = "Connection error";
        speak(errorMessage);
    }
}


/* =========================================================
   TEXT CHAT FORM LISTENER
   ========================================================= */

chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const query = chatInput.value.trim();
    if (query) {
        chatInput.value = "";
        sendMessage(query);
    }
});


/* =========================================================
   VOICE RECOGNITION
   ========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        if (statusText) statusText.textContent = "Listening...";
        micButton?.classList.add("listening");
    };

    recognition.onresult = event => {
        const transcript = event.results[0][0].transcript.trim();
        console.log("USER SAID:", transcript);
        if (transcript) {
            sendMessage(transcript);
        }
    };

    recognition.onerror = event => {
        console.error("Speech recognition error:", event.error);
        isListening = false;
        micButton?.classList.remove("listening");
        if (statusText) statusText.textContent = "Voice recognition error";
    };

    recognition.onend = () => {
        isListening = false;
        micButton?.classList.remove("listening");
        if (statusText && statusText.textContent === "Listening...") {
            statusText.textContent = "Ready when you are";
        }
    };
}


/* =========================================================
   MICROPHONE BUTTON
   ========================================================= */

micButton?.addEventListener("click", () => {
    if (!recognition) {
        if (statusText) statusText.textContent = "Voice recognition unavailable in this browser";
        return;
    }

    if (isListening) {
        recognition.stop();
        return;
    }

    try {
        recognition.start();
    } catch (error) {
        console.error("Could not start recognition:", error);
    }
});


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

const youtubeButton = document.getElementById("youtubeButton");
const googleButton = document.getElementById("googleButton");
const githubButton = document.getElementById("githubButton");

youtubeButton?.addEventListener("click", () => sendMessage("Open YouTube"));
googleButton?.addEventListener("click", () => sendMessage("Open Google"));
githubButton?.addEventListener("click", () => sendMessage("Open GitHub"));


/* =========================================================
   VOICE INITIALIZATION
   ========================================================= */

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

console.log("ULTRON VA frontend initialized.");

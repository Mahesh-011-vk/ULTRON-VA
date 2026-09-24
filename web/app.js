const statusText = document.getElementById("statusText");
const ultronContainer = document.getElementById("ultronContainer");
const micButton = document.getElementById("micButton");
const stopVoiceButton = document.getElementById("stopVoiceButton");

const homeNav = document.getElementById("homeNav");
const chatNav = document.getElementById("chatNav");

const chatPanel = document.getElementById("chatPanel");
const conversation = document.getElementById("conversation");

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
            <strong>${sender}</strong>
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
   VOICE SELECTION
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
        const voice = voices.find(
            item => item.name.includes(preferredName)
        );

        if (voice) {
            return voice;
        }
    }

    return voices.find(
        voice =>
            voice.lang.startsWith("en") &&
            /male|david|daniel|alex|fred|mark/i.test(voice.name)
    ) || voices.find(
        voice => voice.lang.startsWith("en")
    ) || voices[0];
}


/* =========================================================
   ULTRON SPEECH
   ========================================================= */

function speak(text) {
    if (!("speechSynthesis" in window)) {
        statusText.textContent = "Speech synthesis unavailable";
        return;
    }

    window.speechSynthesis.cancel();

    voiceWasStopped = false;

    const speech = new SpeechSynthesisUtterance(text);

    const voice = getUltronVoice();

    if (voice) {
        speech.voice = voice;
        speech.lang = voice.lang || "en-US";
    } else {
        speech.lang = "en-US";
    }

    speech.rate = 0.78;
    speech.pitch = 0.45;
    speech.volume = 1.0;

    speech.onstart = () => {
        statusText.textContent = "ULTRON is speaking...";

        ultronContainer?.classList.add("speaking");
    };

    speech.onend = () => {
        ultronContainer?.classList.remove("speaking");

        if (!voiceWasStopped) {
            statusText.textContent = "Ready when you are";
        }
    };

    speech.onerror = error => {
        console.error("ULTRON speech error:", error);

        ultronContainer?.classList.remove("speaking");

        if (!voiceWasStopped) {
            statusText.textContent = "Speech error";
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

    statusText.textContent = "Voice stopped";
});


/* =========================================================
   SEND MESSAGE TO GEMINI
   ========================================================= */

async function sendMessage(message) {
    if (!message || !message.trim()) {
        return;
    }

    const cleanMessage = message.trim();

    statusText.textContent = "ULTRON is thinking...";

    addMessage("YOU", cleanMessage, "user");

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
            throw new Error(
                `Server returned ${response.status}`
            );
        }

        const data = await response.json();

        const answer =
            data.response ||
            "I received an empty response.";

        addMessage(
            "ULTRON VA",
            answer,
            "assistant"
        );

        speak(answer);

    } catch (error) {
        console.error("Backend error:", error);

        const errorMessage =
            "Sorry. I could not connect to the ULTRON system.";

        addMessage(
            "ULTRON VA",
            errorMessage,
            "assistant"
        );

        statusText.textContent = "Connection error";

        speak(errorMessage);
    }
}


/* =========================================================
   VOICE RECOGNITION
   ========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;

        statusText.textContent =
            "Listening...";

        micButton?.classList.add("listening");
    };


    recognition.onresult = event => {
        const transcript =
            event.results[0][0].transcript.trim();

        console.log(
            "USER SAID:",
            transcript
        );

        if (transcript) {
            sendMessage(transcript);
        }
    };


    recognition.onerror = event => {
        console.error(
            "Speech recognition error:",
            event.error
        );

        isListening = false;

        micButton?.classList.remove("listening");

        statusText.textContent =
            "Voice recognition error";
    };


    recognition.onend = () => {
        isListening = false;

        micButton?.classList.remove("listening");

        if (
            statusText.textContent ===
            "Listening..."
        ) {
            statusText.textContent =
                "Ready when you are";
        }
    };
}


/* =========================================================
   MICROPHONE BUTTON
   ========================================================= */

micButton?.addEventListener("click", () => {
    if (!recognition) {
        statusText.textContent =
            "Voice recognition is unavailable";

        return;
    }

    if (isListening) {
        recognition.stop();
        return;
    }

    try {
        recognition.start();
    } catch (error) {
        console.error(
            "Could not start recognition:",
            error
        );
    }
});


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

const youtubeButton =
    document.getElementById("youtubeButton");

const googleButton =
    document.getElementById("googleButton");

const githubButton =
    document.getElementById("githubButton");


youtubeButton?.addEventListener(
    "click",
    () => sendMessage("Open YouTube")
);


googleButton?.addEventListener(
    "click",
    () => sendMessage("Open Google")
);


githubButton?.addEventListener(
    "click",
    () => sendMessage("Open GitHub")
);


/* =========================================================
   LOAD BROWSER VOICES
   ========================================================= */

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}


console.log("ULTRON VA frontend loaded.");

/* =========================================================
   ULTRON VA — VOICE CONTROL
   ========================================================= */

const micButton = document.getElementById("micButton");
const statusText = document.querySelector(".assistant-status");
const messagesContainer = document.querySelector(".messages");

const ultronContainer =
    document.getElementById("ultronContainer");

let listening = false;


/* =========================================================
   ADD MESSAGE
   ========================================================= */

function addMessage(sender, text, type) {

    const message = document.createElement("div");

    message.className =
        `message ${type}-message`;

    const avatar =
        type === "user" ? "M" : "U";

    message.innerHTML = `
        <div class="avatar ${
            type === "assistant"
                ? "echo-avatar"
                : ""
        }">
            ${avatar}
        </div>

        <div class="message-content">

            <small>
                ${sender}
            </small>

            <p>
                ${text}
            </p>

        </div>
    `;

    messagesContainer.appendChild(message);

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =========================================================
   FIND MALE ULTRON VOICE
   ========================================================= */

function getUltronVoice() {

    const voices =
        window.speechSynthesis.getVoices();

    console.log(
        "AVAILABLE VOICES:",
        voices.map(v => `${v.name} — ${v.lang}`)
    );


    /* -----------------------------------------
       1. STRONG MALE VOICE PREFERENCES
       ----------------------------------------- */

    const maleVoiceNames = [

        "Daniel",
        "Alex",
        "Fred",

        "Google UK English Male",
        "Google US English Male",

        "Microsoft David",
        "Microsoft Mark",
        "Microsoft Guy",

        "Arthur",
        "Thomas",
        "James",
        "George",
        "Oliver",
        "Edward",
        "Ryan",

        "English Male"
    ];


    /* -----------------------------------------
       2. SEARCH FOR KNOWN MALE VOICES
       ----------------------------------------- */

    for (const preferredName of maleVoiceNames) {

        const voice =
            voices.find(v =>
                v.name
                    .toLowerCase()
                    .includes(
                        preferredName.toLowerCase()
                    )
            );

        if (voice) {

            console.log(
                "ULTRON MALE VOICE SELECTED:",
                voice.name,
                voice.lang
            );

            return voice;
        }
    }


    /* -----------------------------------------
       3. MALE KEYWORD SEARCH
       ----------------------------------------- */

    const maleKeywords = [
        "male",
        "david",
        "mark",
        "guy",
        "daniel",
        "alex",
        "fred",
        "arthur",
        "thomas",
        "james",
        "george",
        "ryan",
        "oliver",
        "edward"
    ];


    const maleVoice =
        voices.find(voice => {

            const name =
                voice.name.toLowerCase();

            const language =
                voice.lang.toLowerCase();

            return (
                language.startsWith("en") &&
                maleKeywords.some(keyword =>
                    name.includes(keyword)
                )
            );
        });


    if (maleVoice) {

        console.log(
            "ULTRON MALE KEYWORD VOICE:",
            maleVoice.name
        );

        return maleVoice;
    }


    /* -----------------------------------------
       4. MAC DEFAULT FALLBACK
       ----------------------------------------- */

    const fallbackNames = [
        "Alex",
        "Daniel",
        "Fred"
    ];

    for (const name of fallbackNames) {

        const voice =
            voices.find(v =>
                v.name
                    .toLowerCase()
                    .includes(
                        name.toLowerCase()
                    )
            );

        if (voice) {

            console.log(
                "ULTRON FALLBACK VOICE:",
                voice.name
            );

            return voice;
        }
    }


    /* -----------------------------------------
       5. ENGLISH FALLBACK
       ----------------------------------------- */

    const englishVoice =
        voices.find(v =>
            v.lang
                .toLowerCase()
                .startsWith("en")
        );

    if (englishVoice) {

        console.log(
            "ULTRON ENGLISH FALLBACK:",
            englishVoice.name
        );

        return englishVoice;
    }


    return null;
}


/* =========================================================
   ULTRON SPEECH
   ========================================================= */

function speak(text) {

    if (!("speechSynthesis" in window)) {

        statusText.textContent =
            "Speech synthesis unavailable";

        return;
    }


    /* Stop previous speech */

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    const voice =
        getUltronVoice();


    if (voice) {

        speech.voice = voice;

        speech.lang =
            voice.lang || "en-US";

    } else {

        speech.lang = "en-US";
    }


    /* =====================================================
       ULTRON VOICE SETTINGS
       ===================================================== */

    speech.rate = 0.78;

    speech.pitch = 0.45;

    speech.volume = 1.0;


    /* =====================================================
       SPEAKING START
       ===================================================== */

    speech.onstart = () => {

        console.log(
            "ULTRON STARTED SPEAKING"
        );

        statusText.textContent =
            "ULTRON is speaking...";


        /* Red eye glow */

        ultronContainer?.classList.add(
            "speaking"
        );
    };


    /* =====================================================
       SPEAKING END
       ===================================================== */

    speech.onend = () => {

        console.log(
            "ULTRON FINISHED SPEAKING"
        );

        statusText.textContent =
            "Ready when you are";


        ultronContainer?.classList.remove(
            "speaking"
        );
    };


    /* =====================================================
       SPEECH ERROR
       ===================================================== */

    speech.onerror = (error) => {

        console.error(
            "ULTRON SPEECH ERROR:",
            error
        );

        statusText.textContent =
            "Speech error";


        ultronContainer?.classList.remove(
            "speaking"
        );
    };


    window.speechSynthesis.speak(
        speech
    );
}


/* =========================================================
   LOAD AVAILABLE VOICES
   ========================================================= */

function showAvailableVoices() {

    const voices =
        window.speechSynthesis.getVoices();

    console.log(
        "===================================="
    );

    console.log(
        "ULTRON AVAILABLE VOICES"
    );

    console.log(
        "===================================="
    );

    voices.forEach((voice, index) => {

        console.log(
            `${index + 1}. ${voice.name} | ${voice.lang}`
        );
    });

    console.log(
        "===================================="
    );
}


window.speechSynthesis.onvoiceschanged =
    () => {

        showAvailableVoices();
    };


/* =========================================================
   SEND MESSAGE TO PYTHON
   ========================================================= */

async function sendMessage(message) {

    try {

        statusText.textContent =
            "ULTRON is thinking...";


        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server error"
            );
        }


        const data =
            await response.json();


        addMessage(
            "YOU",
            message,
            "user"
        );


        addMessage(
            "ULTRON VA",
            data.response,
            "assistant"
        );


        speak(
            data.response
        );


    } catch (error) {

        console.error(
            "Backend error:",
            error
        );


        statusText.textContent =
            "Connection error";


        const errorMessage =
            "Sorry. I could not connect to the ULTRON system.";


        addMessage(
            "ULTRON VA",
            errorMessage,
            "assistant"
        );


        speak(
            errorMessage
        );
    }
}


/* =========================================================
   SPEECH RECOGNITION
   ========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (!SpeechRecognition) {

    statusText.textContent =
        "Speech recognition not supported";

    console.error(
        "SpeechRecognition API is not supported."
    );

} else {

    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.maxAlternatives =
        1;


    recognition.onstart = () => {

        listening = true;


        statusText.textContent =
            "Listening...";


        micButton.style.transform =
            "scale(1.12)";


        console.log(
            "ULTRON MICROPHONE STARTED"
        );
    };


    recognition.onresult =
        (event) => {

            const transcript =
                event
                    .results[0][0]
                    .transcript;


            console.log(
                "YOU SAID:",
                transcript
            );


            statusText.textContent =
                "Processing...";


            if (
                transcript.trim()
            ) {

                sendMessage(
                    transcript
                );
            }
        };


    recognition.onerror =
        (event) => {

            console.error(
                "Speech recognition error:",
                event.error
            );


            if (
                event.error ===
                "not-allowed"
            ) {

                statusText.textContent =
                    "Microphone permission denied";

            } else if (
                event.error ===
                "no-speech"
            ) {

                statusText.textContent =
                    "I didn't hear anything";

            } else if (
                event.error ===
                "network"
            ) {

                statusText.textContent =
                    "Speech service unavailable";

            } else {

                statusText.textContent =
                    "Microphone error";
            }
        };


    recognition.onend = () => {

        listening = false;


        micButton.style.transform =
            "scale(1)";


        if (
            statusText.textContent ===
            "Listening..."
        ) {

            statusText.textContent =
                "Ready when you are";
        }


        console.log(
            "ULTRON MICROPHONE STOPPED"
        );
    };


    micButton.addEventListener(
        "click",
        () => {

            if (listening) {

                recognition.stop();

                return;
            }


            try {

                recognition.start();

            } catch (error) {

                console.error(
                    "Could not start microphone:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

const quickActions =
    document.querySelectorAll(
        ".quick-action"
    );


quickActions.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (
                action.includes(
                    "youtube"
                )
            ) {

                sendMessage(
                    "Open YouTube"
                );

            } else if (
                action.includes(
                    "google"
                )
            ) {

                sendMessage(
                    "Open Google"
                );

            } else if (
                action.includes(
                    "github"
                )
            ) {

                sendMessage(
                    "Open GitHub"
                );
            }
        }
    );
});
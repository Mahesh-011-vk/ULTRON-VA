from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from ai_agent import ask_ai
from commands import process_command

import os


app = Flask(
    __name__,
    static_folder="../web",
    static_url_path=""
)

CORS(app)


@app.route("/")
def home():
    return send_from_directory("../web", "index.html")


@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json()

    command = data.get("message", "").strip()

    if not command:
        return jsonify({
            "response": "I didn't receive a message."
        })

    response, should_exit = process_command(command)

    # Unknown command → Local Llama
    if response.startswith("You said"):
        response = ask_ai(command)

    return jsonify({
        "response": response,
        "should_exit": should_exit
    })


if __name__ == "__main__":

    print("===================================")
    print("       ECHO VOICE AGENT")
    print("===================================")
    print("Server running at:")
    print("http://127.0.0.1:5000")
    print("===================================")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
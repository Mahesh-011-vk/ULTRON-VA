from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from ai_agent import ask_ai

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
    data = request.get_json(silent=True) or {}

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "response": "I didn't receive a message."
        }), 400

    response = ask_ai(message)

    return jsonify({
        "response": response
    })


if __name__ == "__main__":
    print("===================================")
    print("           ULTRON VA")
    print("===================================")
    print("Server running at:")
    print("http://127.0.0.1:5000")
    print("===================================")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

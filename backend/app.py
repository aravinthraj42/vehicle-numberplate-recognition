# backend/app.py
from flask import Flask, request, jsonify
from detector import detect_plate
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.route('/')
def index():
    return "✅ Flask Server is Running! Use POST /detect to test plate recognition."


@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    plate_number = detect_plate(path)
    if plate_number:
        return jsonify({'plate_number': plate_number})
    else:
        return jsonify({'error': 'Plate not detected'}), 500

if __name__ == '__main__':
    app.run(debug=True)

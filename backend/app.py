from flask import Flask, request, jsonify
from flask_cors import CORS
from detector import detect_plate
from db import create_db, insert_entry, get_open_entry, update_exit, calculate_fee
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize database
create_db()
logger.info("Database initialized")

@app.route('/')
def index():
    logger.info("Root endpoint accessed")
    return "✅ Flask Server is Running! Use POST /detect to test plate recognition."

@app.route('/detect', methods=['POST'])
def detect():
    logger.info("Received request at /detect")
    try:
        if 'file' not in request.files:
            logger.error("No file uploaded in request")
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            logger.error("No file selected")
            return jsonify({'error': 'No file selected'}), 400

        filename = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        logger.info(f"Saving file to {path}")
        file.save(path)

        logger.info("Calling detect_plate function")
        plate_number = detect_plate(path)

        if plate_number:
            plate_number = plate_number.upper().strip()
            existing_entry = get_open_entry(plate_number)
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            if existing_entry:
                # Handle exit
                plate_id, entry_time = existing_entry
                fee = calculate_fee(entry_time, current_time)
                update_exit(plate_id, current_time, fee)
                os.remove(path)
                logger.info(f"Exit recorded for {plate_number}")
                return jsonify({
                    'plate_number': plate_number,
                    'entry_time': entry_time,
                    'exit_time': current_time,
                    'fee': fee
                })
            else:
                # Handle new entry
                insert_entry(plate_number, current_time)
                os.remove(path)
                logger.info(f"New entry recorded for {plate_number}")
                return jsonify({
                    'plate_number': plate_number,
                    'entry_time': current_time
                })
        else:
            os.remove(path)
            logger.warning("Plate not detected or invalid format")
            return jsonify({'error': 'Plate not detected or invalid format'}), 400

    except Exception as e:
        logger.error(f"Error in /detect: {str(e)}")
        if 'path' in locals() and os.path.exists(path):
            os.remove(path)  # Clean up on error
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/logs', methods=['GET'])
def get_logs():
    logger.info("Fetching parking logs")
    try:
        import sqlite3
        conn = sqlite3.connect('parking.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM parking_log')
        logs = cursor.fetchall()
        conn.close()
        logger.info(f"Retrieved {len(logs)} logs")
        return jsonify([{
            'id': log[0],
            'plate_number': log[1],
            'entry_time': log[2],
            'exit_time': log[3],
            'fee': log[4]
        } for log in logs])
    except Exception as e:
        logger.error(f"Error fetching logs: {str(e)}")
        return jsonify({'error': f'Failed to fetch logs: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server")
    app.run(debug=True)

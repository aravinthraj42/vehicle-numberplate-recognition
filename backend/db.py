import sqlite3
import logging
from datetime import datetime
import traceback
import hashlib

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DB_FILE = 'parking.db'

def create_db():
    """Create the SQLite database and tables."""
    try:
        logger.info("Creating database and tables if not exists")
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            
            # Create parking_log table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS parking_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    plate_number TEXT,
                    entry_time TEXT,
                    exit_time TEXT,
                    fee INTEGER
                )
            ''')
            
            # Create users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
        logger.info("Database and tables created successfully")
        
        # Insert default users if they don't exist
        insert_default_users()
        
    except Exception:
        logger.error("Error creating database:\n%s", traceback.format_exc())


def insert_entry(plate_number, entry_time):
    """Insert a new vehicle entry into the database."""
    try:
        logger.info(f"Inserting entry: plate={plate_number}, time={entry_time}")
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO parking_log (plate_number, entry_time) VALUES (?, ?)',
                (plate_number, entry_time)
            )
            conn.commit()
        logger.info("Entry inserted successfully")
    except Exception:
        logger.error("Error inserting entry:\n%s", traceback.format_exc())


def get_open_entry(plate_number):
    """Retrieve open entry for a vehicle (no exit time)."""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT id, entry_time FROM parking_log WHERE plate_number = ? AND exit_time IS NULL',
                (plate_number,)
            )
            return cursor.fetchone()
    except Exception:
        logger.error("Error fetching open entry:\n%s", traceback.format_exc())
        return None


def update_exit(plate_id, exit_time, fee):
    """Update exit time and fee for a parking record."""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'UPDATE parking_log SET exit_time = ?, fee = ? WHERE id = ?',
                (exit_time, fee, plate_id)
            )
            conn.commit()
        logger.info(f"Exit updated successfully for ID {plate_id}")
    except Exception:
        logger.error("Error updating exit:\n%s", traceback.format_exc())


def calculate_fee(entry_time_str, exit_time_str):
    """Calculate the parking fee based on entry and exit time."""
    entry_time = datetime.strptime(entry_time_str, '%Y-%m-%d %H:%M:%S')
    exit_time = datetime.strptime(exit_time_str, '%Y-%m-%d %H:%M:%S')
    duration = exit_time - entry_time
    total_hours = duration.total_seconds() / 3600
    total_days = duration.days

    if total_days >= 1:
        fee = 40 + (total_days - 1) * 25
    else:
        if total_hours <= 1:
            fee = 10
        else:
            fee = 10 + int(total_hours - 1) * 5
    return fee


def show_all():
    """Print all parking records from the database."""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM parking_log')
            rows = cursor.fetchall()
            if not rows:
                logger.info("No records found.")
            for row in rows:
                print(row)
    except Exception:
        logger.error("Error fetching all records:\n%s", traceback.format_exc())


# Optional: Clear previous entries (use with caution)
def delete_all_entries():
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM parking_log')
            conn.commit()
        logger.info("All entries deleted.")
    except Exception:
        logger.error("Error deleting all entries:\n%s", traceback.format_exc())


def hash_password(password):
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed_password):
    """Verify a password against its hash."""
    return hash_password(password) == hashed_password


def insert_default_users():
    """Insert default admin users if they don't exist."""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            
            # Check if users already exist
            cursor.execute('SELECT COUNT(*) FROM users')
            user_count = cursor.fetchone()[0]
            
            if user_count == 0:
                # Insert default users
                default_users = [
                    ('admin@email.com', 'Password@01'),
                    ('smartparking@email.com', 'Password@02')
                ]
                
                for email, password in default_users:
                    password_hash = hash_password(password)
                    cursor.execute(
                        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
                        (email, password_hash)
                    )
                    logger.info(f"Inserted default user: {email}")
                
                conn.commit()
                logger.info("Default users created successfully")
            else:
                logger.info("Users already exist, skipping default user creation")
                
    except Exception:
        logger.error("Error inserting default users:\n%s", traceback.format_exc())


def authenticate_user(email, password):
    """Authenticate a user by email and password."""
    try:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT id, email, password_hash FROM users WHERE email = ?',
                (email,)
            )
            user = cursor.fetchone()
            
            if user and verify_password(password, user[2]):
                return {
                    'id': user[0],
                    'email': user[1]
                }
            return None
            
    except Exception:
        logger.error("Error authenticating user:\n%s", traceback.format_exc())
        return None


# Run this file directly to test
if __name__ == "__main__":
    create_db()
    # delete_all_entries()  # Uncomment to clear DB on run

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # insert_entry("TN 69 BR 5531", now)

    show_all()

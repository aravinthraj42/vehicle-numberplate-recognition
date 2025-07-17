import sqlite3
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_db():
    try:
        logger.info("Creating database")
        conn = sqlite3.connect('parking.db')
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS parking_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plate_number TEXT,
                entry_time TEXT,
                exit_time TEXT,
                fee INTEGER
            )
        ''')
        conn.commit()
        logger.info("Database and table created successfully")
    except Exception as e:
        logger.error(f"Error creating database: {str(e)}")
    finally:
        conn.close()

def insert_entry(plate_number, entry_time):
    try:
        logger.info(f"Inserting entry: plate={plate_number}, time={entry_time}")
        conn = sqlite3.connect('parking.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO parking_log (plate_number, entry_time) VALUES (?, ?)',
                      (plate_number, entry_time))
        conn.commit()
        logger.info("Entry inserted successfully")
    except Exception as e:
        logger.error(f"Error inserting entry: {str(e)}")
    finally:
        conn.close()



def show_all():
    conn = sqlite3.connect('parking.db')
    cur = conn.cursor()
    cur.execute('SELECT * FROM parking_log')
    rows = cur.fetchall()
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    show_all()       
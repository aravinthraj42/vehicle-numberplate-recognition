# backend/db.py
import sqlite3

def create_db():
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
    conn.close()

def insert_entry(plate_number, entry_time):
    conn = sqlite3.connect('parking.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO parking_log (plate_number, entry_time) VALUES (?, ?)',
                   (plate_number, entry_time))
    conn.commit()
    conn.close()

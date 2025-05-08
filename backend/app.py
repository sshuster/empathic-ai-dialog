
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import json
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
def get_db_connection():
    conn = sqlite3.connect('personas.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        industry TEXT NOT NULL,
        characteristics TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS personas (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        location TEXT NOT NULL,
        job_title TEXT NOT NULL,
        interests TEXT NOT NULL,
        challenges TEXT NOT NULL,
        avatar TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (company_id) REFERENCES companies (id)
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        persona_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (persona_id) REFERENCES personas (id)
    )
    ''')
    
    conn.commit()
    conn.close()

# Initialize the database if it doesn't exist
if not os.path.exists('personas.db'):
    init_db()

# API Routes
@app.route('/api/company', methods=['POST'])
def create_company():
    data = request.get_json()
    
    company_id = str(uuid.uuid4())
    company = {
        'id': company_id,
        'name': data['name'],
        'industry': data['industry'],
        'characteristics': json.dumps(data['characteristics']),
        'description': data['description'],
        'created_at': datetime.now().isoformat()
    }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO companies (id, name, industry, characteristics, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        (company['id'], company['name'], company['industry'], company['characteristics'], company['description'], company['created_at'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'id': company_id, **data}), 201

@app.route('/api/persona', methods=['POST'])
def create_persona():
    data = request.get_json()
    
    persona_id = str(uuid.uuid4())
    persona = {
        'id': persona_id,
        'company_id': data['company_id'],
        'name': data['name'],
        'age': data['age'],
        'gender': data['gender'],
        'location': data['location'],
        'job_title': data['jobTitle'],
        'interests': json.dumps(data['interests']),
        'challenges': json.dumps(data['challenges']),
        'avatar': data['avatar'],
        'created_at': datetime.now().isoformat()
    }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO personas (id, company_id, name, age, gender, location, job_title, interests, challenges, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        (persona['id'], persona['company_id'], persona['name'], persona['age'], persona['gender'], persona['location'], persona['job_title'], persona['interests'], persona['challenges'], persona['avatar'], persona['created_at'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'id': persona_id, **data}), 201

@app.route('/api/message', methods=['POST'])
def create_message():
    data = request.get_json()
    
    message_id = str(uuid.uuid4())
    message = {
        'id': message_id,
        'persona_id': data['persona_id'],
        'sender': data['sender'],
        'text': data['text'],
        'timestamp': datetime.now().isoformat()
    }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO messages (id, persona_id, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)',
        (message['id'], message['persona_id'], message['sender'], message['text'], message['timestamp'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'id': message_id, **data}), 201

@app.route('/api/messages/<persona_id>', methods=['GET'])
def get_messages(persona_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM messages WHERE persona_id = ? ORDER BY timestamp ASC', (persona_id,))
    messages = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(messages)

@app.route('/api/persona/<persona_id>', methods=['GET'])
def get_persona(persona_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM personas WHERE id = ?', (persona_id,))
    persona = dict(cursor.fetchone())
    conn.close()
    
    # Parse JSON strings back to arrays
    persona['interests'] = json.loads(persona['interests'])
    persona['challenges'] = json.loads(persona['challenges'])
    
    return jsonify(persona)

@app.route('/api/company/<company_id>', methods=['GET'])
def get_company(company_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM companies WHERE id = ?', (company_id,))
    company = dict(cursor.fetchone())
    conn.close()
    
    # Parse JSON string back to array
    company['characteristics'] = json.loads(company['characteristics'])
    
    return jsonify(company)

if __name__ == '__main__':
    app.run(debug=True)

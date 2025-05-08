
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'personas.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
const initDb = () => {
  db.serialize(() => {
    // Create companies table
    db.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        industry TEXT NOT NULL,
        characteristics TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    
    // Create personas table
    db.run(`
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
    `);
    
    // Create messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        persona_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (persona_id) REFERENCES personas (id)
      )
    `);
  });
};

// Initialize the database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  initDb();
}

// API Routes
// Create a new company
app.post('/api/company', (req, res) => {
  const data = req.body;
  const companyId = uuidv4();
  const company = {
    id: companyId,
    name: data.name,
    industry: data.industry,
    characteristics: JSON.stringify(data.characteristics),
    description: data.description,
    created_at: new Date().toISOString()
  };
  
  db.run(
    'INSERT INTO companies (id, name, industry, characteristics, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [company.id, company.name, company.industry, company.characteristics, company.description, company.created_at],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: companyId, ...data });
    }
  );
});

// Get company details
app.get('/api/company/:company_id', (req, res) => {
  const { company_id } = req.params;
  
  db.get('SELECT * FROM companies WHERE id = ?', [company_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Company not found" });
    }
    
    // Parse JSON string back to array
    const company = {
      ...row,
      characteristics: JSON.parse(row.characteristics)
    };
    
    res.json(company);
  });
});

// Create a new persona
app.post('/api/persona', (req, res) => {
  const data = req.body;
  const personaId = uuidv4();
  const persona = {
    id: personaId,
    company_id: data.company_id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    location: data.location,
    job_title: data.jobTitle,
    interests: JSON.stringify(data.interests),
    challenges: JSON.stringify(data.challenges),
    avatar: data.avatar,
    created_at: new Date().toISOString()
  };
  
  db.run(
    'INSERT INTO personas (id, company_id, name, age, gender, location, job_title, interests, challenges, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [persona.id, persona.company_id, persona.name, persona.age, persona.gender, persona.location, persona.job_title, persona.interests, persona.challenges, persona.avatar, persona.created_at],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: personaId, ...data });
    }
  );
});

// Get persona details
app.get('/api/persona/:persona_id', (req, res) => {
  const { persona_id } = req.params;
  
  db.get('SELECT * FROM personas WHERE id = ?', [persona_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Persona not found" });
    }
    
    // Parse JSON strings back to arrays
    const persona = {
      ...row,
      interests: JSON.parse(row.interests),
      challenges: JSON.parse(row.challenges)
    };
    
    res.json(persona);
  });
});

// Create a new message
app.post('/api/message', (req, res) => {
  const data = req.body;
  const messageId = uuidv4();
  const message = {
    id: messageId,
    persona_id: data.persona_id,
    sender: data.sender,
    text: data.text,
    timestamp: new Date().toISOString()
  };
  
  db.run(
    'INSERT INTO messages (id, persona_id, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)',
    [message.id, message.persona_id, message.sender, message.text, message.timestamp],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: messageId, ...data });
    }
  );
});

// Get messages for a persona
app.get('/api/messages/:persona_id', (req, res) => {
  const { persona_id } = req.params;
  
  db.all('SELECT * FROM messages WHERE persona_id = ? ORDER BY timestamp ASC', [persona_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

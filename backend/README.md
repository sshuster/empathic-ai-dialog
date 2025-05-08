
# Node.js & SQLite Backend

This is a Node.js API backend with SQLite database integration for the Empathic AI Customer Personas application.

## Setup Instructions

1. Make sure you have Node.js 14.x installed:
```
node --version
```

2. Install dependencies:
```
cd backend
npm install
```

3. Run the Node.js application:
```
npm start
```

The server will start at http://localhost:5000/

## API Endpoints

- `POST /api/company` - Create a new company
- `GET /api/company/<company_id>` - Get company details
- `POST /api/persona` - Create a new persona
- `GET /api/persona/<persona_id>` - Get persona details
- `POST /api/message` - Create a new message
- `GET /api/messages/<persona_id>` - Get all messages for a persona

## Database Schema

The SQLite database (`personas.db`) will be created automatically with the following tables:

1. `companies` - Stores company information
2. `personas` - Stores persona information linked to companies
3. `messages` - Stores messages from chat experiences linked to personas

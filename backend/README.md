
# Flask & SQLite Backend

This is a simple Flask API backend with SQLite database integration for the Empathic AI Customer Personas application.

## Setup Instructions

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
- On Windows: `venv\Scripts\activate`
- On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run the Flask application:
```
python app.py
```

The server will start at http://127.0.0.1:5000/

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

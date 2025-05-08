
#!/bin/bash

# Demo script for Empathic AI Customer Personas

echo "Starting Empathic AI Customer Personas demo..."

# Set Node.js version to 14 if nvm is available
if command -v nvm &> /dev/null; then
  echo "Setting Node.js version to 14..."
  nvm use 14 || nvm install 14
fi

# Check Node.js version
node_version=$(node -v)
echo "Using Node.js version: $node_version"

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies 
echo "Installing frontend dependencies..."
npm install

# Run both frontend and backend
echo "Starting application..."
npm run dev & 
cd backend && npm start


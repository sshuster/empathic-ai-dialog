
@echo off
echo Starting Empathic AI Customer Personas demo...

REM Check Node.js version
echo Checking Node.js version...
node -v

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

REM Run both frontend and backend
echo Starting application...
start cmd /k "npm run dev"
start cmd /k "cd backend && npm start"


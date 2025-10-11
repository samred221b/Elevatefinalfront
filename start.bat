@echo off
echo Starting Habit Tracker Full Stack Application...
echo.

echo Step 1: Setting up MongoDB Atlas password
echo Please make sure to replace <db_password> in backend/.env with your actual MongoDB Atlas password
echo.

echo Step 2: Starting Backend Server...
echo Opening new terminal for backend...
start cmd /k "cd backend && echo Starting Backend Server on http://localhost:3001 && npm run dev"

echo.
echo Step 3: Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Step 4: Starting Frontend Development Server...
echo Starting Frontend on http://localhost:5173
npm run dev

echo.
echo Both servers should now be running:
echo - Backend API: http://localhost:5000
echo - Frontend App: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul

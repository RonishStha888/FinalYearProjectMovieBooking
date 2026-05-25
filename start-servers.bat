@echo off
echo ========================================
echo Starting RTX Cinema Servers
echo ========================================
echo.

echo Starting Backend Server...
start "RTX Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "RTX Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers are starting!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul

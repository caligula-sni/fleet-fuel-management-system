@echo off
title Fleet Fuel Management Server
color 1F
cls

echo ================================================
echo   FLEET FUEL CONSUMPTION MANAGEMENT
echo   Local Server Startup - Windows 11
echo ================================================
echo.

:: ── Check Python ────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo.
    echo Install it from: https://www.python.org/downloads/
    echo IMPORTANT: Check "Add Python to PATH" during install.
    echo.
    pause
    exit /b
)

for /f "tokens=*" %%i in ('python --version') do echo [OK] %%i found.
echo.

:: ── Check / Install Flask ────────────────────────
echo Checking for Flask...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Flask not found. Installing now...
    echo This only happens once.
    echo.
    pip install flask
    echo.
)

echo [OK] Flask ready.
echo.

:: ── Start Server ─────────────────────────────────
echo ================================================
echo   Server starting...
echo.
echo   Open your browser and go to:
echo   http://localhost:5000
echo.
echo   Keep this window open while using the app.
echo   To stop: close this window or press CTRL+C
echo ================================================
echo.

cd /d "%~dp0"
python server.py

echo.
echo Server stopped.
pause

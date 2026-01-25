@echo off
REM Renewable Grid Simulator - Project Initialization Script (Windows)
REM This script sets up the development environment

echo ========================================
echo Renewable Grid Simulator - Initialization
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3 is not installed. Please install Python 3.9+ first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [OK] Python found
echo [OK] Node.js found
echo.

REM Initialize Git repository
echo Initializing Git repository...
if not exist ".git" (
    git init
    git add .
    git commit -m "Initial commit: Project structure"
    echo [OK] Git repository initialized
) else (
    echo [INFO] Git repository already exists
)
echo.

REM Backend setup
echo Setting up Python backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [INFO] Virtual environment already exists
)

echo Installing backend dependencies...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt
echo [OK] Backend dependencies installed

cd ..
echo.

REM Frontend setup
echo Setting up React frontend...
cd frontend

if not exist "node_modules" (
    echo Installing Node.js dependencies (this may take a few minutes)...
    call npm install
    echo [OK] Frontend dependencies installed
) else (
    echo [INFO] Node modules already exist
    echo Run 'npm install' to update dependencies if needed
)

cd ..
echo.

REM Summary
echo ========================================
echo [OK] Project initialization complete!
echo.
echo Next steps:
echo.
echo 1. Start the backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload
echo.
echo 2. Start the frontend (new terminal):
echo    cd frontend
echo    npm start
echo.
echo 3. Open your browser:
echo    Backend API: http://localhost:8000
echo    Frontend: http://localhost:3000
echo    API Docs: http://localhost:8000/docs
echo.
echo Read README.md for the full development roadmap
echo Read docs\architecture.md to understand the system
echo.
echo Happy coding!
echo.
pause

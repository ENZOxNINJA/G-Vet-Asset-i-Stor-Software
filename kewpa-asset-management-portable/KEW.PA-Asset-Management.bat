@echo off
title KEW.PA Asset Management System
color 0A

echo ================================================================
echo                KEW.PA ASSET MANAGEMENT SYSTEM
echo              Malaysian Government Standard Compliance
echo ================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js detected: 
node --version

echo.
echo [INFO] Checking dependencies...
if not exist "node_modules" (
    echo [INFO] Installing dependencies for first time...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Setting up database environment...
set DATABASE_URL=postgresql://localhost:5432/kewpa_assets

echo.
echo [INFO] Starting KEW.PA Asset Management System...
echo [INFO] The application will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ================================================================
echo.

npm run dev

pause
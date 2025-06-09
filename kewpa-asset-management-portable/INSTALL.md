# Installation Guide

## Windows Installation
1. Download and install Node.js from https://nodejs.org
2. Download and install PostgreSQL from https://postgresql.org
3. Extract this folder to your desired location
4. Double-click start.bat
5. Follow the on-screen instructions

## Linux/macOS Installation
1. Install Node.js: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
2. Install PostgreSQL: sudo apt-get install postgresql
3. Extract this folder to your desired location
4. Run: chmod +x start.sh && ./start.sh
5. Follow the on-screen instructions

## Database Configuration
1. Create a new PostgreSQL database named 'kewpa_assets'
2. Update the DATABASE_URL in start.bat or start.sh with your database credentials
3. Format: postgresql://username:password@localhost:5432/kewpa_assets

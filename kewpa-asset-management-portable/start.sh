#!/bin/bash
echo "Starting KEW.PA Asset Management System..."
echo "Please ensure you have Node.js installed (version 18 or higher)"
echo ""
echo "Setting up database connection..."
export DATABASE_URL="postgresql://localhost:5432/kewpa_assets"
echo ""
echo "Installing dependencies..."
npm install
echo ""
echo "Starting the application..."
npm run dev
echo ""
echo "The application will be available at http://localhost:5000"
import fs from 'fs';
import path from 'path';

console.log('Creating portable KEW.PA Asset Management System...');

// Create portable directory structure
const portableDir = './kewpa-asset-management-portable';
const dirs = [
  portableDir,
  `${portableDir}/server`,
  `${portableDir}/client`,
  `${portableDir}/shared`,
  `${portableDir}/docs`
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy essential files
const filesToCopy = [
  { src: 'package.json', dest: `${portableDir}/package.json` },
  { src: 'server', dest: `${portableDir}/server`, isDir: true },
  { src: 'client', dest: `${portableDir}/client`, isDir: true },
  { src: 'shared', dest: `${portableDir}/shared`, isDir: true },
  { src: 'drizzle.config.ts', dest: `${portableDir}/drizzle.config.ts` },
  { src: 'vite.config.ts', dest: `${portableDir}/vite.config.ts` },
  { src: 'tailwind.config.ts', dest: `${portableDir}/tailwind.config.ts` },
  { src: 'postcss.config.js', dest: `${portableDir}/postcss.config.js` }
];

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const items = fs.readdirSync(src);
    items.forEach(item => {
      if (item !== 'node_modules' && item !== '.git' && item !== 'dist') {
        copyRecursive(path.join(src, item), path.join(dest, item));
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

filesToCopy.forEach(({ src, dest, isDir }) => {
  if (fs.existsSync(src)) {
    if (isDir) {
      copyRecursive(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`✓ Copied ${src}`);
  }
});

// Create startup scripts
const startScript = `@echo off
echo Starting KEW.PA Asset Management System...
echo Please ensure you have Node.js installed (version 18 or higher)
echo.
echo Setting up database connection...
set DATABASE_URL=postgresql://localhost:5432/kewpa_assets
echo.
echo Installing dependencies...
npm install
echo.
echo Starting the application...
npm run dev
echo.
echo The application will be available at http://localhost:5000
pause`;

const startShScript = `#!/bin/bash
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
echo "The application will be available at http://localhost:5000"`;

fs.writeFileSync(`${portableDir}/start.bat`, startScript);
fs.writeFileSync(`${portableDir}/start.sh`, startShScript);
fs.chmodSync(`${portableDir}/start.sh`, '755');

// Create README
const readme = `# KEW.PA Asset Management System
## Malaysian Government Asset Management Compliance System

### Features
- Full KEW.PA forms compliance (KEW.PA-1 to KEW.PA-10)
- Asset registration and tracking
- Movement and loan management
- Damage reporting system
- Supplier management
- Comprehensive reporting

### Requirements
- Node.js 18 or higher
- PostgreSQL database
- Windows, macOS, or Linux

### Quick Start
1. Install Node.js from https://nodejs.org
2. Install PostgreSQL from https://postgresql.org
3. Run start.bat (Windows) or start.sh (Linux/macOS)
4. Open http://localhost:5000 in your browser

### Database Setup
Create a PostgreSQL database named 'kewpa_assets' and update the DATABASE_URL in the startup script.

### Manual Installation
1. npm install
2. Set DATABASE_URL environment variable
3. npm run db:push
4. npm run dev

### Support
This system follows Malaysian Government KEW.PA standards for asset management.
`;

fs.writeFileSync(`${portableDir}/README.md`, readme);

// Create installation guide
const installGuide = `# Installation Guide

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
`;

fs.writeFileSync(`${portableDir}/INSTALL.md`, installGuide);

console.log('✅ Portable KEW.PA Asset Management System created!');
console.log(`📁 Location: ${portableDir}`);
console.log('📋 Contents:');
console.log('   - Complete source code');
console.log('   - Startup scripts (start.bat for Windows, start.sh for Linux/macOS)');
console.log('   - Installation guide');
console.log('   - README with system overview');
console.log('');
console.log('🚀 To run: Navigate to the folder and run start.bat (Windows) or start.sh (Linux/macOS)');
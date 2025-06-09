import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building KEW.PA Asset Management System executable...');

try {
  // Step 1: Build the frontend
  console.log('1. Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 2: Bundle the server with ncc
  console.log('2. Bundling server...');
  execSync('npx ncc build server/index.ts -o dist/server --minify', { stdio: 'inherit' });

  // Step 3: Create package.json for executable
  const executablePackageJson = {
    "name": "kewpa-asset-management",
    "version": "1.0.0",
    "description": "KEW.PA Asset Management System - Malaysian Government Standard",
    "main": "dist/server/index.js",
    "bin": "dist/server/index.js",
    "pkg": {
      "scripts": ["dist/server/index.js"],
      "assets": [
        "dist/client/**/*",
        "node_modules/@neondatabase/**/*"
      ],
      "targets": [
        "node18-win-x64",
        "node18-linux-x64",
        "node18-macos-x64"
      ]
    },
    "dependencies": {}
  };

  fs.writeFileSync('package-exe.json', JSON.stringify(executablePackageJson, null, 2));

  // Step 4: Create executable using pkg
  console.log('3. Creating executable...');
  execSync('npx pkg package-exe.json --out-path ./executables/', { stdio: 'inherit' });

  console.log('✅ Executable created successfully!');
  console.log('📁 Files created in ./executables/ directory:');
  console.log('   - kewpa-asset-management-win.exe (Windows)');
  console.log('   - kewpa-asset-management-linux (Linux)');
  console.log('   - kewpa-asset-management-macos (macOS)');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
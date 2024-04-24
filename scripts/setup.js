// scripts/setup.js

// Installer les dépendances
const { execSync } = require('child_process');
execSync('npm install');

console.log('Configuration terminée.');
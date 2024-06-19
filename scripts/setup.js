// scripts/setup.js

// Require the 'execSync' function from the 'child_process' module
const { execSync } = require("child_process");

// Run 'npm install' synchronously to install dependencies
execSync("npm install");

// Log a message indicating the configuration is completed
console.log("Configuration terminée.");
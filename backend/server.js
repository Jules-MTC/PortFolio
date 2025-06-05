// Load environment variables from the .env file into process.env
require('dotenv').config({ path: '/var/www/html/PortFolio/.env' });
// Import required modules
const fs = require("fs"); // File system module for reading files
const https = require("https"); // HTTPS module to create a secure server
const express = require("express"); // Web framework for Node.js
const multer = require("multer"); // Middleware for handling multipart/form-data (file uploads)
const nodemailer = require("nodemailer"); // Module to send emails
const packageJson = require("../package.json"); // Import package.json to get the application version
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const i18n = require("i18n"); // Internationalization module
const session = require("express-session"); // Middleware to handle user sessions
const crypto = require("crypto"); // Module to generate cryptographic random values

// Generate a random secret for session management
const secret = crypto.randomBytes(64).toString("hex");

// Initialize an Express application
const app = express();
const port = 3000;
const upload = multer(); // Initialize Multer to handle form data

// ---------------------- Middleware Setup ---------------------- //

// Enable CORS to allow cross-origin requests
app.use(cors());

// Parse incoming form data without file uploads (text-based form submissions)
app.use(upload.none());

// Enable JSON parsing for incoming request bodies
app.use(express.json());

// Configure session management
app.use(
  session({
    secret: secret, // Use a randomly generated secret for security
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: { secure: process.env.NODE_ENV === "production" }, // Enable secure cookies only in production
  })
);

// ---------------------- i18n (Internationalization) Setup ---------------------- //

// Configure i18n for handling translations
i18n.configure({
  locales: ["en", "fr"], // Supported languages
  directory: __dirname + "/locales", // Directory where translation files are stored
  defaultLocale: "en", // Default language
  objectNotation: true, // Allows using nested translation keys like "menu.home"
});

console.log("Process env", process.env.NODE_ENV);

// Initialize i18n middleware
app.use(i18n.init);

// ---------------------- Routes ---------------------- //

// Route to handle form submission and send email
app.post("/api/send-email", (req, res) => {
  // Extract form data from request body
  const { name, subject, email, phonecountry, phonecode, phone, message } = req.body;
  console.log("Received form submission:", req.body);

  // Validate that all required fields are provided
  if (!name || !email || !phone || !message) {
    return res.status(400).send("All fields are required.");
  }

  // Configure the email transporter using SMTP settings
  const transporterConfig = {
    host: "ssl0.ovh.net", // SMTP server host
    port: 587,
    secure: false, // Use TLS instead of SSL
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS, // Email sender address from environment variables
      pass: process.env.EMAIL_FROM_PASSWORD, // Email sender password from environment variables
    },
  };

  // If running in development mode, disable strict TLS verification
  if (process.env.NODE_ENV === "development") {
    transporterConfig.tls = { rejectUnauthorized: false };
  }

  // Create a transporter instance for sending emails
  const transporter = nodemailer.createTransport(transporterConfig);

  // Configure email options
  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: process.env.EMAIL_TO_ADDRESS, // Recipient email
    subject: `${subject} - ${name}`, // Email subject
    text: `Name: ${name}\nEmail: ${email}\nPhone Country: ${phonecountry}\nPhone: +${phonecode} ${phone}\nMessage: ${message}`, // Email body
    replyTo: email, // Set the "Reply-To" header to the sender's email
  };

  // Send the email using the configured transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error during email sending:", error);
      res.status(500).send("An error occurred during email sending.");
    } else {
      res.status(200).send("Email sent successfully.");
    }
  });
});

// Route to retrieve the API version from package.json
app.get("/api/version", (req, res) => {
  res.json({ version: packageJson.version });
});

// Middleware to set the language based on request headers or session
app.use((req, res, next) => {
  const language = req.headers["accept-language"] || req.session.language || "en"; // Default to English if no language is specified
  i18n.setLocale(language); // Set the locale based on detected language
  next(); // Continue processing request
});

// Route to set the preferred language for the user
app.post("/api/set-language", (req, res, next) => {
  req.session.language = req.body.language; // Store language preference in session
  i18n.setLocale(req.body.language); // Change language
  req.session.save((err) => {
    if (err) return next(err); // Handle session save error
    console.log("Language set to:", req.body.language);
    res.json({ success: true });
  });
});

// ---------------------- HTTPS Server Configuration ---------------------- //

let privateKey, certificate, ca;

if (process.env.NODE_ENV === "production") {
  // Read SSL certificate files for HTTPS in production
  privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, "utf8");
  certificate = fs.readFileSync(process.env.SSL_CERT_PATH, "utf8");
  ca = fs.readFileSync(process.env.SSL_CA_PATH, "utf8");
} else {
  console.log("Running in development mode, skipping SSL setup.");
}

// Start the HTTPS server if in production, otherwise start a regular HTTP server
if (process.env.NODE_ENV === "production") {
  console.log("Starting HTTPS server on port", port);
  https
    .createServer({ key: privateKey, cert: certificate, ca: ca }, app)
    .listen(port);
} else {
  app.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
  });
}

// Define SSL credentials object (used if HTTPS is enabled)
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// Load environment variables from .env file into process.env
require("dotenv").config();

// Import required modules
const fs = require("fs");
const http = require('http');
const https = require("https");
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const packageJson = require("../package.json");
const cors = require("cors");
const i18n = require("i18n");
const session = require("express-session");
const lusca = require("lusca");

// Generate a random secret for session management
const secret = require("crypto").randomBytes(64).toString("hex");

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

// Middleware setup

// 1. Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// 2. Parse incoming form data with multer
app.use(upload.none());

// 3. Parse JSON bodies
app.use(express.json());

// 4. Setup session middleware BEFORE Lusca
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Secure cookies in production
  })
);

// 5. Configure Lusca CSRF protection AFTER sessions
app.use(lusca({
  csrf: {
    value: (req) => req.headers['x-csrf-token'], // Lire le jeton CSRF des en-têtes
  },
}));

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  console.log("Session ID:", req.sessionID);
  console.log("CSRF Token from Header:", req.headers['x-csrf-token']);
  console.log("CSRF Token from Request:", req.csrfToken());
  next();
});

// 6. Configure i18n for internationalization
i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  objectNotation: true,
});

// Initialize i18n AFTER sessions and Lusca
app.use(i18n.init);

// Routes and Additional Middleware

// Route to retrieve CSRF token
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Route to handle form submission and send email
app.post("/send-email", (req, res) => {
  // Extract form data
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !message) {
    return res.status(400).send("All fields are required.");
  }

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // Upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS,
      pass: process.env.EMAIL_FROM_PASSWORD,
    },
  });

  // Compose email options
  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: process.env.EMAIL_TO_ADDRESS,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    replyTo: email,
  };

  // Send email and handle response
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error during email sending:", error);
      res.status(500).send("An error occurred during email sending.");
    } else {
      res.status(200).send("Email sent successfully.");
    }
  });
});

// Route to retrieve API version from package.json
app.get("/api/version", (req, res) => {
  res.json({ version: packageJson.version });
});

// Middleware to set language based on Accept-Language header or session
app.use((req, res, next) => {
  const language =
    req.headers["accept-language"] || req.session.language || "en";
  i18n.setLocale(language);
  next();
});

// Route to set language preference
app.post("/api/set-language", (req, res) => {
  console.log("Expected CSRF Token:", req.csrfToken());
  console.log("Received CSRF Token:", req.headers["x-csrf-token"]);
  console.log("Session ID:", req.sessionID);
  const selectedLanguage = req.body.language;
  if (!selectedLanguage) {
    return res.status(400).json({ success: false });
  }

  req.session.language = selectedLanguage;
  i18n.setLocale(selectedLanguage);
  res.json({ success: true });
});

// HTTPS server configuration for production
let server;
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/portfolio.julesantoine.tech/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/portfolio.julesantoine.tech/fullchain.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/portfolio.julesantoine.tech/chain.pem",
    "utf8"
  );

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  // Create HTTPS server
  server = https.createServer(credentials, app);
} else {
  // Create HTTP server for development
  server = http.createServer(app);
}

// Start server on specified port
server.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

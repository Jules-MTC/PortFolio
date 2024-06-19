// Load environment variables from .env file into process.env
require("dotenv").config();

// Import required modules
const fs = require("fs");
const https = require("https");
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const packageJson = require("../package.json");
const cors = require("cors");
const i18n = require("i18n");
const session = require("express-session");
const csrf = require("lusca").csrf;

// Generate a random secret for session management
const secret = require("crypto").randomBytes(64).toString("hex");

// Initialize Express application
const app = express();
const port = 3000;
const upload = multer();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(upload.none()); // Parse incoming form data with multer
app.use(express.json()); // Parse JSON bodies

// Configure i18n for internationalization
i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  objectNotation: true,
});

app.use(i18n.init);

// Setup session middleware
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // Use secure cookies
  })
);

// Enable CSRF protection for all routes
const csrfProtection = csrf();
app.use(csrfProtection);

// Route to retrieve CSRF token
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Route to handle form submission and send email
app.post("/send-email", (req, res) => {
  // Check if CSRF token is valid
  if (!req.csrfToken()) {
    return res.status(403).send("CSRF token missing or invalid.");
  }

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
  const selectedLanguage = req.body.language;
  if (!selectedLanguage) {
    return res.status(400).json({ success: false });
  }

  req.session.language = selectedLanguage;
  i18n.setLocale(selectedLanguage);
  res.json({ success: true });
});

// HTTPS server configuration
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
const httpsServer = https.createServer(credentials, app);

// Start HTTPS server on specified port
httpsServer.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});
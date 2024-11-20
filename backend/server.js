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
const crypto = require("crypto");

// Generate a random secret for session management
const secret = crypto.randomBytes(64).toString("hex");

// Initialize Express application
const app = express();
const port = 3000;
const upload = multer();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(upload.none()); // Parse incoming form data with multer
app.use(express.json()); // Parse JSON bodies

// Setup session middleware
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Configure i18n for internationalization
i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  objectNotation: true,
});

app.use(i18n.init);

// Route to handle form submission and send email
app.post("/send-email", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).send("All fields are required.");
  }

  const transporterConfig = {
    host: "us2.smtp.mailhostbox.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS,
      pass: process.env.EMAIL_FROM_PASSWORD,
    },
  };
  if (process.env.NODE_ENV === "devlopment") {
    transporterConfig.tls = { rejectUnauthorized: false };
  }
  const transporter = nodemailer.createTransport(transporterConfig);
  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: process.env.EMAIL_TO_ADDRESS,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    replyTo: email,
  };

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
app.post("/api/set-language", (req, res, next) => {
  req.session.language = req.body.language;
  i18n.setLocale(req.body.language);
  req.session.save((err) => {
    if (err) return next(err);
    console.log("Language set to:", req.body.language);
    res.json({ success: true });
  });
});

// HTTPS server configuration
let privateKey, certificate, ca;

if (process.env.NODE_ENV === "production") {
  privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, "utf8");
  certificate = fs.readFileSync(process.env.SSL_CERT_PATH, "utf8");
  ca = fs.readFileSync(process.env.SSL_CA_PATH, "utf8");
} else {
  console.log("Running in development mode, skipping SSL setup.");
}

if (process.env.NODE_ENV === "production") {
  https
    .createServer({ key: privateKey, cert: certificate, ca: ca }, app)
    .listen(port);
} else {
  app.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
  });
}

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

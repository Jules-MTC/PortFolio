require("dotenv").config();

const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const packageJson = require("../package.json");
const cors = require("cors");
const i18n = require("i18n");
const session = require('express-session');
const secret = require('crypto').randomBytes(64).toString('hex');

const app = express();
const port = 3000;
const upload = multer();

app.use(cors());
app.use(upload.none());

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + '/locales',
  defaultLocale: "en",
  objectNotation: true,
});

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

app.post("/send-email", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).send("All fields are required.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS,
      pass: process.env.EMAIL_FROM_PASSWORD,
    },
  });

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
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

app.get("/api/version", (req, res) => {
  res.json({ version: packageJson.version });
});

// Middleware pour définir la langue à partir de la session
app.use((req, res, next) => {
  if (req.session && req.session.language) {
    i18n.setLocale(req.session.language);
  }
  next();
});

app.post("/api/set-language", (req, res) => {
  const selectedLanguage = req.body.language;

  // Enregistrez la langue dans la session
  req.session.language = selectedLanguage;

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server start on port : ${port}`);
});
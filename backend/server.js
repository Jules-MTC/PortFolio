require("dotenv").config();

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

const secret = require("crypto").randomBytes(64).toString("hex");
const app = express();
const port = 3000;
const upload = multer();

app.use(cors());
app.use(upload.none());
app.use(express.json());

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  objectNotation: true,
});

app.use(i18n.init);

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(csrf());

app.get("/form", (req, res) => {
  res.render("form", { csrfToken: req.csrfToken() });
});

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

app.use((req, res, next) => {
  const language =
    req.headers["accept-language"] || req.session.language || "en";
  i18n.setLocale(language);
  next();
});

app.post("/api/set-language", (req, res) => {
  const selectedLanguage = req.body.language;
  if (!selectedLanguage) {
    return res.status(400).json({ success: false });
  }

  req.session.language = selectedLanguage;
  i18n.setLocale(selectedLanguage);
  res.json({ success: true });
});

// Lire les certificats SSL
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

// Créer un serveur HTTPS
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});

require("dotenv").config();

const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const packageJson = require("../package.json");
const cors = require("cors");
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

const upload = multer();

app.use(cors());
app.use(upload.none());

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/portfolio.julesantoine.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/portfolio.julesantoine.tech/cert.pem')
};

https.createServer(options, app).listen(443);

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

app.listen(port, () => {
  console.log(`Server start on port : ${port}`);
});

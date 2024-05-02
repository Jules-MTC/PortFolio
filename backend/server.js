require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const packageJson = require("../package.json");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/send-email", (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log(name, email, phone, message);
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS,
      pass: process.env.EMAIL_FROM_PASSWORD
    },
    logger: false,
    debug: false
  });
  

  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: process.env.EMAIL_TO_ADDRESS,
    subject: `Nouveau message de ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error during email sending:", error);
      res
        .status(500)
        .send("An error occurred during email sending.");
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
  console.log(`Server start on port :${port}`);
});

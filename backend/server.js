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
  // CHANGER TO A SIMPLE PASSWORD
  // Configuration de nodemailer pour envoyer l'e-mail
  const transporter = nodemailer.createTransport({
    service: "Outlook",
    auth: {
      user: process.env.EMAIL_FROM_ADDRESS,
      pass: process.env.EMAIL_FROM_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS,
    to: process.env.EMAIL_TO_ADDRESS,
    subject: `Nouveau message de ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`,
  };

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      res
        .status(500)
        .send("Une erreur est survenue lors de l'envoi de l'e-mail.");
    } else {
      console.log("E-mail envoyé :", info.response);
      res.status(200).send("E-mail envoyé avec succès.");
    }
  });
});

app.get("/api/version", (req, res) => {
  res.json({ version: packageJson.version });
});

app.listen(port, () => {
  console.log(`Server start on http://localhost:${port}`);
});

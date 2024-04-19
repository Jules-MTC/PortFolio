const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    console.log("HERE");
    const { name, email, phone, message } = req.body;

    // Configuration de nodemailer pour envoyer l'e-mail
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'email',
            pass: 'pwd'
        }
    });

    const mailOptions = {
        from: email,
        to: 'email',
        subject: `Nouveau message de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
            res.status(500).send('Une erreur est survenue lors de l\'envoi de l\'e-mail.');
        } else {
            console.log('E-mail envoyé :', info.response);
            res.status(200).send('E-mail envoyé avec succès.');
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

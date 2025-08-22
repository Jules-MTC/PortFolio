const http = require('http');
const { exec } = require('child_process');

const PORT = 3001;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      // Vérifie que c'est un push sur master
      const payload = JSON.parse(body);
      if (payload.ref === 'refs/heads/master') {
        // Exécute le script de déploiement
        exec('/home/ubuntu/deploy.sh', (err, stdout, stderr) => {
          if (err) {
            console.error(`Erreur : ${stderr}`);
            return;
          }
          console.log(`Sortie : ${stdout}`);
        });
      }
      res.end('OK');
    });
  } else {
    res.end('Webhook ready');
  }
});

server.listen(PORT, () => console.log(`Serveur Webhook écoute sur le port ${PORT}`));

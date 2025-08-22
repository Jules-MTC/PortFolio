#!/bin/bash
cd /var/www/html/PortFolio

# Récupère les derniers changements
git pull origin master

# Installe les dépendances
npm install

# Relance le backend
pm2 restart all

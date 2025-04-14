#!/bin/bash
# Script pour connecter le dépôt local à GitHub via SSH
# Remplacez "tontonantonin" par votre nom d'utilisateur GitHub et "ao-checklist-gamifie" par le nom de votre dépôt

# Ajouter le dépôt distant
git remote add origin git@github.com:tontonantonin/ao-checklist-gamifie.git

# Pousser le code vers GitHub
git push -u origin main

echo "Le dépôt a été connecté à GitHub et le code a été poussé."
echo "Vous pouvez maintenant accéder à votre dépôt sur GitHub : https://github.com/tontonantonin/ao-checklist-gamifie"

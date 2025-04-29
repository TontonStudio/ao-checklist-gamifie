#!/bin/bash
# Script pour initialiser et connecter le dépôt local à GitHub

# Variables (à modifier selon vos besoins)
GITHUB_USERNAME="tontonantonin"
REPO_NAME="ao-checklist-gamifie"
BRANCH="main"

# Vérifier si git est installé
if ! command -v git &> /dev/null; then
    echo "Git n'est pas installé. Veuillez installer Git avant de continuer."
    exit 1
fi

# Vérifier si le dossier est déjà un dépôt git
if [ ! -d ".git" ]; then
    echo "Initialisation du dépôt Git local..."
    git init
    git add .
    git commit -m "Initial commit"
else
    echo "Le dépôt Git est déjà initialisé."
fi

# Configurer le dépôt distant
echo "Configuration du dépôt distant..."
git remote remove origin 2>/dev/null # Supprime l'origine existante s'il y en a une
git remote add origin "git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"

# Pousser le code vers GitHub
echo "Envoi du code vers GitHub..."
git push -u origin $BRANCH

echo "✅ Configuration terminée avec succès!"
echo "Accédez à votre dépôt sur GitHub : https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🔍 Pour vérifier la configuration:"
echo "  git remote -v"
echo ""
echo "🚀 Pour de futurs changements, utilisez:"
echo "  git add ."
echo "  git commit -m \"Description de vos changements\""
echo "  git push"

# Guide de mise en place GitHub pour AO Checklist

Ce guide explique les étapes complètes pour déployer l'application AO Checklist sur GitHub et la rendre disponible en ligne via GitHub Pages.

## Préparation et documentation

Tous les fichiers nécessaires ont été préparés et organisés selon les standards modernes des projets open source :

- **README.md** - Documentation principale du projet
- **CHANGELOG.md** - Historique des versions et modifications
- **CONTRIBUTING.md** - Guide pour contribuer au projet
- **LICENSE** - Licence MIT
- **CODE_OF_CONDUCT.md** - Code de conduite pour les contributeurs
- **SECURITY.md** - Politique de sécurité
- **DEPLOYMENT.md** - Guide de déploiement
- **.gitignore** - Configuration des fichiers à ignorer
- **.gitattributes** - Configuration des attributs Git
- **_config.yml** - Configuration pour GitHub Pages
- **github_setup.sh** - Script d'automatisation pour l'initialisation GitHub
- **commands_github.txt** - Guide des commandes Git pour les débutants

## Étapes pour finaliser la mise en place

### 1. Créer un dépôt sur GitHub

1. Rendez-vous sur [https://github.com/new](https://github.com/new)
2. Choisissez un nom pour votre dépôt (suggestion : `ao-checklist-gamifie`)
3. Ajoutez une description : "Outil de suivi gamifié de réponse aux marchés publics"
4. Choisissez "Public" pour la visibilité
5. Ne cochez PAS "Add a README file" ni d'autres options
6. Cliquez sur "Create repository"

### 2. Initialiser et pousser le code (deux options)

#### Option 1 : Utiliser le script automatisé (recommandé)

1. Ouvrez le fichier `github_setup.sh` et modifiez la variable `GITHUB_USERNAME` avec votre nom d'utilisateur GitHub
2. Rendez le script exécutable et lancez-le :
   ```bash
   chmod +x github_setup.sh
   ./github_setup.sh
   ```

#### Option 2 : Commandes manuelles

Exécutez ces commandes dans l'ordre, en remplaçant `VOTRE_NOM_UTILISATEUR` par votre nom d'utilisateur GitHub :

```bash
# Initialiser le dépôt Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit"

# Connecter au dépôt distant
git remote add origin git@github.com:VOTRE_NOM_UTILISATEUR/ao-checklist-gamifie.git

# Pousser le code vers GitHub
git push -u origin main
```

### 3. Configurer GitHub Pages

1. Accédez à votre dépôt sur GitHub
2. Cliquez sur "Settings" (en haut à droite)
3. Dans le menu latéral, sélectionnez "Pages"
4. Dans "Source", sélectionnez "Deploy from a branch"
5. Dans "Branch", sélectionnez "main" et "/ (root)" puis cliquez sur "Save"
6. Attendez quelques minutes que le site soit déployé

### 4. Vérifier le déploiement

Votre application sera disponible à l'adresse :
```
https://VOTRE_NOM_UTILISATEUR.github.io/ao-checklist-gamifie/
```

### 5. Personnaliser (optionnel)

Si vous souhaitez personnaliser davantage votre dépôt :

1. **Description et tags** : Ajoutez des tags et une description dans les paramètres du dépôt
2. **README** : Personnalisez le README avec des captures d'écran spécifiques
3. **Informations de contact** : Mettez à jour les adresses email dans les fichiers de documentation
4. **Workflow GitHub Actions** : Ajoutez des tests automatisés si nécessaire

## Maintenance future

Pour mettre à jour le projet à l'avenir :

```bash
# Récupérer les dernières modifications (si plusieurs contributeurs)
git pull

# Ajouter vos modifications
git add .

# Créer un commit avec un message descriptif
git commit -m "Description des modifications"

# Pousser vers GitHub
git push
```

## Résolution des problèmes

Si vous rencontrez des difficultés :

- **Erreur d'authentification GitHub** : Vérifiez que vous avez bien configuré vos clés SSH ou utilisez HTTPS avec un token ou vos identifiants
- **Conflit de fusion** : Utilisez `git pull --rebase` pour intégrer les changements distants avant de pousser
- **GitHub Pages ne s'actualise pas** : Patientez quelques minutes et vérifiez les paramètres dans "Settings > Pages"

Pour toute assistance supplémentaire, contactez [contact@tontonstudio.com](mailto:contact@tontonstudio.com).

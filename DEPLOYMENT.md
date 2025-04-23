# Guide de déploiement - AO Checklist

Ce guide explique comment déployer l'application AO Checklist sur différentes plateformes.

## Déploiement local

Pour utiliser l'application localement (sur votre propre ordinateur) :

1. Téléchargez ou clonez le dépôt :
   ```
   git clone https://github.com/tontonantonin/ao-checklist-gamifie.git
   ```

2. Naviguez vers le dossier du projet et ouvrez le fichier `index.html` dans votre navigateur web préféré.

3. C'est tout ! L'application est entièrement statique et ne nécessite aucun serveur.

## Déploiement sur GitHub Pages (recommandé)

GitHub Pages est une solution gratuite et simple pour héberger des sites web statiques directement depuis un dépôt GitHub.

### Étape 1 : Préparation du dépôt

Assurez-vous que votre code est déjà sur GitHub. Si ce n'est pas le cas, suivez les instructions dans le fichier `commands_github.txt`.

### Étape 2 : Configuration de GitHub Pages

1. Accédez à votre dépôt GitHub dans votre navigateur
2. Cliquez sur l'onglet "Settings" (Paramètres)
3. Dans le menu de gauche, sélectionnez "Pages"
4. Dans la section "Source", sélectionnez la branche "main" et le dossier racine "/ (root)"
5. Cliquez sur "Save" (Enregistrer)
6. Patientez quelques minutes pour que GitHub déploie votre site

### Étape 3 : Accès au site déployé

Une fois le déploiement terminé, GitHub vous fournira une URL du type :
```
https://votre-nom-utilisateur.github.io/ao-checklist-gamifie/
```

Cette URL est publique et peut être partagée avec quiconque doit utiliser l'application.

## Déploiement sur Netlify

Netlify est une plateforme moderne pour déployer des sites statiques avec des fonctionnalités supplémentaires.

### Étape 1 : Créer un compte Netlify

1. Rendez-vous sur [Netlify](https://www.netlify.com/) et créez un compte ou connectez-vous
2. Cliquez sur "New site from Git"

### Étape 2 : Connecter votre dépôt

1. Choisissez votre fournisseur Git (GitHub, GitLab, ou Bitbucket)
2. Autorisez Netlify à accéder à vos dépôts
3. Sélectionnez le dépôt ao-checklist-gamifie

### Étape 3 : Configuration du déploiement

1. Laissez les champs de configuration par défaut (pas besoin de commande de build ou de dossier de publication car c'est un site statique simple)
2. Cliquez sur "Deploy site"

### Étape 4 : Personnalisation de l'URL (optionnel)

1. Une fois le site déployé, Netlify lui attribue une URL aléatoire
2. Pour personnaliser cette URL, cliquez sur "Site settings" puis "Change site name"

## Déploiement sur un serveur web traditionnel

Si vous préférez utiliser votre propre hébergement web :

1. Téléchargez tous les fichiers du projet
2. Transférez-les sur votre serveur web via FTP ou SSH
3. Assurez-vous que les fichiers sont dans le répertoire racine public de votre serveur ou dans un sous-dossier dédié

## Considérations pour le déploiement en production

Pour un environnement de production optimal, considérez ces bonnes pratiques :

### Optimisation des performances

- Minimisez les fichiers CSS et JavaScript pour réduire leur taille
- Compressez les images pour accélérer le chargement
- Activez la mise en cache du navigateur pour les ressources statiques

### Sécurité

- Utilisez HTTPS pour protéger les données des utilisateurs
- Ajoutez des en-têtes de sécurité appropriés comme Content-Security-Policy

### Suivi et analytique (optionnel)

Si vous souhaitez suivre l'utilisation de l'application, vous pouvez ajouter un outil d'analyse comme Google Analytics ou Matomo.

## Mise à jour de l'application déployée

Pour mettre à jour l'application après des modifications :

1. Poussez vos changements vers le dépôt GitHub :
   ```
   git add .
   git commit -m "Description des modifications"
   git push
   ```

2. Le déploiement se mettra à jour automatiquement pour GitHub Pages et Netlify
3. Pour un serveur web traditionnel, transférez à nouveau les fichiers modifiés

## Résolution des problèmes courants

### Le site ne se met pas à jour après les modifications

- Vérifiez que vous avez bien poussé vos modifications vers la bonne branche
- Videz le cache de votre navigateur
- Attendez quelques minutes (GitHub Pages peut prendre jusqu'à 10 minutes pour se mettre à jour)

### Problèmes d'affichage ou de fonctionnalités

- Vérifiez la console du navigateur (F12) pour identifier les erreurs
- Assurez-vous que tous les fichiers ont été correctement transférés
- Vérifiez que les chemins relatifs dans le HTML sont corrects par rapport à la structure de votre hébergement

Pour toute assistance supplémentaire, contactez [contact@tontonstudio.com](mailto:contact@tontonstudio.com).

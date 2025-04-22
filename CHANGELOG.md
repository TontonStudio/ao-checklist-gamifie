# Changelog

## Version 2.2.0 (Avril 2025)

### Améliorations majeures
- **Refonte du mode warning** : Couleurs améliorées pour meilleure lisibilité (rouge, blanc, noir)
- **Fond noir en mode warning** : Meilleur contraste visuel hors du cadre de l'application
- **Chargement automatique des fichiers** : Le fichier tasks.js se charge désormais automatiquement dès sa sélection
- **Fade-out du son en mode warning** : Le son d'alerte s'arrête en fondu lorsque toutes les tâches sont complétées
- **Logo cliquable** : Accès direct au site Tonton Studio en cliquant sur le logo
- **Réorganisation de l'interface d'accueil** : Mise en avant du GPT spécialisé

### Corrections de bugs
- **Arrêt du son en retour accueil** : Le son d'alerte ne se relance plus en revenant à l'accueil
- **Amélioration des contrastes** : Meilleure lisibilité des textes en mode warning
- **Contrôle du son cohérent** : Affichage amélioré du bouton de contrôle du son

## Version 2.1.0 (Avril 2025)

### Améliorations majeures
- **Intégration du GPT spécialisé** : Ajout des références au GPT Tonton Studio pour la génération assistée de fichiers tasks.js
- **Documentation enrichie** : Mise à jour des instructions pour inclure l'utilisation du GPT spécialisé
- **Simplification de la création de tasks.js** : Amélioration du processus de création avec l'aide du GPT

## Version 2.0.0 (Avril 2025)

### Améliorations majeures
- **Refonte de l'architecture CSS** : Passage à une structure modulaire avec fichiers CSS séparés par composant
- **Système audio amélioré** : Nouveau contrôleur de son centralisé avec gestion robuste des erreurs de lecture
- **Interface responsive** : Meilleure adaptation à tous les formats d'écran, notamment sur mobile
- **Bouton de contrôle du son** : Ajout d'un bouton permettant d'activer/désactiver le son d'avertissement
- **Détection intelligente du mode warning** : Activation automatique avec diverses vérifications pour plus de fiabilité

### Améliorations techniques
- Réduction significative des logs inutiles en production
- Mode debug configurable pour faciliter le développement
- Optimisation des performances pour les animations et effets visuels
- Meilleure séparation des responsabilités entre modules
- Détection plus précise des changements d'écran avec MutationObserver
- Sauvegarde plus fiable de l'état du son entre les sessions

### Corrections de bugs
- Résolution du problème de lecture automatique du son dans les navigateurs modernes
- Correction de l'affichage du bouton de son qui apparaissait parfois sur l'écran d'accueil
- Résolution du conflit entre plusieurs gestionnaires de son
- Correction du problème de désactivation du son qui ne fonctionnait pas correctement
- Amélioration de la fiabilité de sauvegarde/restauration de la progression

### Autres changements
- Documentation mise à jour et étendue
- Ajout de commentaires détaillés dans le code
- Meilleure gestion des erreurs avec messages descriptifs
- Suppression des dépendances inutiles pour réduire la taille
- Code plus lisible et plus facile à maintenir

## Version 1.0.0 (Mars 2025)

- Version initiale de l'application
- Interface inspirée de la Game Boy
- Suivi des tâches avec effets visuels et sonores
- Compte à rebours avec mode alerte
- Mode doré de victoire
- Gestion des noms de fichiers

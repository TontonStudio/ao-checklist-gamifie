# Changelog

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

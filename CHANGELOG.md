# Changelog

## Version 2.5.2 (Avril 2025)

### Corrections de bugs du bouton de son et de la barre de progression
- **Bouton de son en mode pause/play** : Le bouton de son ne réinitialise plus la position de lecture, mais agit comme un bouton pause/play
- **Conservation de l'apparence du bouton** : L'apparence visuelle du bouton (🔊/🔇) est maintenue tout en modifiant son comportement
- **Correction de la barre de progression** : Correction de la barre de progression qui conservait son apparence warning après chargement d'une nouvelle liste de tâches
- **Réinitialisation complète des styles** : Nettoyage complet des styles lors des transitions entre les modes normaux et warning

## Version 2.5.1 (Avril 2025)

### Corrections de bugs en mode warning
- **Lisibilité des noms de fichiers** : Correction du fond vert foncé en rouge très clair pour l'affichage des noms de fichiers
- **Cohérence des boutons "Copier"** : Uniformisation des boutons "Copier" pour maintenir la même apparence, qu'ils soient associés à des tâches cochées ou non
- **Améliorations visuelles** : Renforcement de la cohérence de la palette de couleurs rouge en mode warning

## Version 2.5.0 (Avril 2025)

### Nouvelles fonctionnalités
- **Drag and drop amélioré** : Ajout de la possibilité de glisser-déposer le fichier tasks.js directement depuis le bureau
- **Feux d'artifice plus spectaculaires** : Augmentation du nombre et de la qualité des feux d'artifice en mode doré
- **Gestion robuste des zones de drag and drop** : Amélioration de l'expérience utilisateur lors du glisser-déposer

### Corrections de bugs
- **Cohérence visuelle en mode warning** : Correction des couleurs de la barre de progression fixe et du progress-spacer
- **Uniformisation des bordures** : Modification de la couleur de la bordure inférieure du header en mode warning (#660000)
- **Stabilité du drag and drop** : Correction du problème de comportement erratique de la zone de drop

## Version 2.4.0 (Avril 2025)

### Optimisations de performance
- **Animations optimisées** : Utilisation de transform et opacity pour des animations plus fluides
- **Réduction de la consommation de ressources** : Limitation intelligente du nombre d'éléments animés
- **Object pooling** : Implémentation d'un système de réutilisation des éléments DOM pour les particules
- **Chargement optimisé** : Préchargement des ressources critiques et chargement asynchrone des ressources secondaires
- **Défilement fluide** : Amélioration du throttling pour la barre de progression fixe
- **Meilleure gestion des événements** : Délégation d'événements optimisée et réduction des écouteurs
- **Gestion efficace de la mémoire** : Nettoyage proactif des ressources
- **Optimisation des opérations DOM** : Réduction des reflows et des manipulations DOM
- **Mise en cache des éléments** : Mise en cache des éléments DOM fréquemment utilisés
- **Optimisation du rendu CSS** : Utilisation de will-change pour préparer les animations
- **Pause automatique des animations** : Suspension des effets quand la page n'est pas visible

## Version 2.3.1 (Avril 2025)

### Documentation et structure
- **Documentation améliorée** : Mise à jour complète de la documentation du projet
- **Structure GitHub** : Préparation du projet pour un déploiement sur GitHub
- **Badges README** : Ajout de badges pour la version et la licence dans le README
- **Guide d'installation** : Ajout de sections installation et déploiement dans le README
- **Fichiers standardisés** : Mise en conformité avec les standards de documentation open source

## Version 2.3.0 (Avril 2025)

### Améliorations majeures
- **Barre de progression fixe** : Implémentation robuste du système de barre de progression fixe en haut de l'écran
- **Optimisation des titres longs** : Gestion améliorée des titres de tâches longs avec troncature et ellipsis
- **Badges "DONE!" optimisés** : Visibilité garantie lors du défilement, même avec la barre fixée
- **Bloc de donation redesigné** : Style plus cohérent avec médaillon et meilleure mise en valeur
- **Espace uniforme des sous-tâches** : Correction des problèmes d'espacement dans les listes

### Optimisations techniques
- **Gestionnaire de barre fixe** : Nouveau système utilisant requestAnimationFrame pour une meilleure performance
- **Z-index optimisés** : Hiérarchie claire pour éviter les problèmes de superposition
- **Structure CSS modulaire** : Séparation claire des styles par fonctionnalité
- **Animation des badges** : Correction de l'animation pour maintenir la position pendant la pulsation
- **Gestion des débordements** : Meilleur contrôle des éléments qui débordent de leurs conteneurs

### Architecture & refactorisation
- **Nettoyage du code** : Suppression des logs et fonctions de débogage
- **Consolidation des correctifs** : Intégration des correctifs temporaires dans le code principal
- **Élimination des doublons** : Suppression des styles redondants et conflictuels
- **Optimisation des fichiers** : Réduction du nombre de fichiers et meilleure organisation
- **Amélioration de la maintenabilité** : Code plus lisible et mieux structuré

## Version 2.2.2 (Avril 2025)

### Nettoyage et optimisation
- **Simplification du code** : Suppression des logs et commentaires de développement
- **Documentation améliorée** : Mise à jour du README pour refléter toutes les fonctionnalités
- **Optimisation des performances** : Réduction de la taille des scripts
- **Stabilisation** : Élimination des fonctions redondantes et code mort

## Version 2.2.1 (Avril 2025)

### Améliorations finales
- **Perfection du mode warning** : Élimination totale des éléments verts résiduels
- **Correctif du séparateur** : Remplacement dynamique du séparateur sous le compte à rebours
- **Boutons plus distincts** : Différenciation claire entre "Réinitialiser" et "Retour Accueil"
- **Cohérence visuelle complète** : Palette de couleurs uniformément rouge en mode warning

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
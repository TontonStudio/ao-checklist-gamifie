# Outil de suivi gamifié de réponse aux marchés publics

Un outil web gamifié au style Game Boy pour suivre l'avancement des réponses aux appels d'offres de Tonton Studio.

<p align="center">
  <img src="img/TTS_Logo.png" alt="Tonton Studio Logo" width="250" height="250"/>
</p>

## Description

Cet outil offre une expérience ludique pour gérer les tâches liées à la préparation d'une réponse à un appel d'offres public. Inspiré par l'esthétique Game Boy rétro (8-bit), il transforme une activité potentiellement fastidieuse en une expérience engageante avec des animations, des effets sonores et un système de récompense visuelle.

## Fonctionnalités

- Suivi des livrables et sous-tâches pour les appels d'offres
- Interface interactive au style Game Boy rétro
- Checkbox principale permettant de cocher/décocher toutes les sous-tâches d'un livrable en un seul clic
- Visualisation intuitive avec symboles de coche (✓) pour les tâches complétées
- Mise en évidence visuelle des tâches cochées (couleur de fond différente)
- Effets visuels et sonores de récompense
- Sauvegarde automatique de la progression (localStorage)
- Mode "Victoire" avec thème doré lorsque 100% des tâches sont complétées
- Défilement automatique vers le haut lors de la complétion totale
- Conception responsive optimisée pour mobile et desktop
- Fonction de copie du nom de fichier pour chaque livrable
- Fonctionne entièrement côté client, sans dépendance serveur

## Installation

Aucune installation n'est nécessaire. Il suffit d'ouvrir le fichier `index.html` dans un navigateur web moderne.

```bash
# Cloner le dépôt
git clone https://github.com/tontonantonin/ao-checklist.git

# Naviguer dans le dossier
cd ao-checklist

# Ouvrir dans le navigateur
open index.html  # sur macOS
```

## Technologies utilisées

- HTML5
- CSS3 (avec animations et transitions)
- JavaScript vanilla (sans frameworks)
- LocalStorage pour la persistance des données

## Structure du projet

```
/__CHECKLIST__/
├── index.html        # Structure HTML principale
├── style.css         # Feuille de style Game Boy
├── script.js         # Logique interactive
├── tasks.js          # Liste des livrables et sous-tâches
├── img/              # Images et logo
└── audio/            # Effets sonores
```

## Personnalisation

Pour adapter l'outil à vos besoins :

1. Modifiez la liste des livrables et sous-tâches dans le fichier `tasks.js`
2. Ajustez les styles dans `style.css` pour changer l'apparence
3. Remplacez les sons dans le dossier `audio/` par vos propres effets sonores

## Compatibilité et accessibilité

Compatible avec les navigateurs modernes :
- Chrome (recommandé)
- Firefox
- Safari
- Edge

Fonctionnalités d'accessibilité et UX :
- Contraste optimisé pour une meilleure lisibilité
- Interactions tactiles améliorées sur appareils mobiles
- Retours visuels clairs des actions utilisateur
- Taille d'interface adaptative selon les appareils
- Sélection intuitive par catégorie (checkbox principale)

## Crédits

Développé par [Tonton Studio](https://tontonstud.io) © 2025

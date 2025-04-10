# Outil de suivi gamifié de réponse aux marchés publics

Un outil web gamifié au style Game Boy pour suivre l'avancement des réponses aux appels d'offres de Tonton Studio.

![Tonton Studio Logo](img/TTS_Logo.png)

## Description

Cet outil offre une expérience ludique pour gérer les tâches liées à la préparation d'une réponse à un appel d'offres public. Inspiré par l'esthétique Game Boy rétro (8-bit), il transforme une activité potentiellement fastidieuse en une expérience engageante avec des animations, des effets sonores et un système de récompense visuelle.

## Fonctionnalités

- Suivi des livrables et sous-tâches pour les appels d'offres
- Interface interactive au style Game Boy rétro
- Effets visuels et sonores de récompense
- Sauvegarde automatique de la progression (localStorage)
- Mode "Victoire" avec thème doré lorsque 100% des tâches sont complétées
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

## Compatibilité

Compatible avec les navigateurs modernes :
- Chrome (recommandé)
- Firefox
- Safari
- Edge

## Crédits

Développé par [Tonton Studio](https://tontonstud.io) © 2025

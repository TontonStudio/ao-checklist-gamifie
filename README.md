# AO Checklist - Tonton Studio (v2)

Outil de suivi gamifié de réponse aux marchés publics, inspiré par l'esthétique des jeux vidéo rétro de type Game Boy.

## Fonctionnalités

- **Interface rétro Game Boy** : Design 8-bit nostalgique
- **Suivi des tâches** : Gestion de livrables et sous-tâches pour les appels d'offres
- **Gamification** : Effets visuels et sonores, animations lors de la complétion des tâches
- **Compte à rebours** : Suivi du temps restant jusqu'à la date limite de l'AO
- **Mode alerte** : Avertissement visuel et sonore quand il reste moins de 48h
- **Contrôle du son** : Possibilité de couper/réactiver le son d'alerte
- **Copie des noms de fichier** : Facilité de copier les noms de fichiers formatés selon les exigences du marché
- **Personnalisation** : Chargement d'un fichier tasks.js spécifique à chaque appel d'offres
- **Sauvegarde locale** : Conservation de la progression entre les sessions

## Structure du projet

```
/__CHECKLIST__/
├── index.html              # Page principale
├── css/                    # Styles modulaires
│   ├── base.css            # Styles de base
│   ├── tasks.css           # Styles des tâches
│   ├── buttons.css         # Styles des boutons
│   ├── progress.css        # Styles de la barre de progression
│   ├── effects.css         # Styles des effets visuels
│   ├── modes.css           # Styles des modes (doré, warning)
│   ├── responsive.css      # Styles adaptatifs
│   ├── welcome.css         # Styles de la page d'accueil
│   └── countdown.css       # Styles du compte à rebours
├── js/
│   ├── app.js              # Initialisation de l'application
│   ├── config.js           # Configuration globale
│   ├── logger.js           # Utilitaire de journalisation
│   ├── utils.js            # Fonctions utilitaires
│   ├── sound-control.js    # Gestion du son
│   ├── countdown.js        # Gestion du compte à rebours
│   ├── effects.js          # Effets visuels et sonores
│   ├── tasks-manager.js    # Gestion des tâches
│   └── fix-warning-mode.js # Assure le bon fonctionnement du mode warning
├── audio/
│   ├── check.mp3           # Son de cochage
│   ├── uncheck.mp3         # Son de décochage
│   ├── success.mp3         # Son de complétion
│   ├── finish.mp3          # Son de finalisation
│   └── warning.mp3         # Son d'avertissement
└── img/
    ├── TTS_Logo.png        # Logo standard
    └── TTS_Logo_Checked.png # Logo activé (quand tout est complété)
```

## Format du fichier tasks.js

```javascript
// Configuration globale de l'appel d'offres
const aoConfig = {
  title: "Titre de l'appel d'offres",
  deadline: "YYYY-MM-DDThh:mm:ss", // Format ISO pour la date limite
  reference: "REF-YYYY-X" // Référence de l'AO
};

// Structure des tâches
const tasks = [
  {
    label: 'Nom du livrable',
    filename: 'Nom_de_fichier_global.pdf', // Fichier global optionnel
    isMultiFile: false, // Indique si le livrable est un fichier unique ou multiple
    subtasks: [
      { label: "Sous-tâche 1", filename: "Fichier_Soustache1.pdf" }, // Avec fichier
      { label: "Sous-tâche 2" } // Sans fichier
    ]
  },
  {
    label: 'Livrable multi-fichiers',
    isMultiFile: true, // Pour les livrables comportant plusieurs fichiers distincts
    subtasks: [
      { label: "Document 1", filename: "Document1.pdf" },
      { label: "Document 2", filename: "Document2.pdf" }
    ]
  }
];
```

## Utilisation

1. Ouvrez l'application dans un navigateur web
2. Créez votre fichier tasks.js en utilisant notre [GPT spécialisé](https://chatgpt.com/g/g-680541e3745c8191b7bca4aa6861ad09-tonton-studio-gamified-ao-checklist-generator) ou en suivant le format décrit dans la documentation
3. Chargez votre fichier tasks.js spécifique à l'appel d'offres
4. Suivez votre progression en cochant les tâches accomplies
5. Un compte à rebours vous indique le temps restant avant la date limite
6. Lorsqu'il reste moins de 48h, un mode d'alerte visuel et sonore s'active
7. Utilisez les boutons "Copier" pour récupérer les noms de fichiers standardisés
8. Quand toutes les tâches sont complétées, un mode "victoire" s'active avec des effets visuels

## Modes d'interface

- **Mode normal** : L'interface de base, inspirée de la Game Boy
- **Mode warning** : Activé automatiquement lorsqu'il reste moins de 48h pour répondre à l'AO
- **Mode doré** : Activé lorsque toutes les tâches sont complétées

## Nouveautés de la version 2

- Architecture modulaire des styles CSS pour une meilleure maintenance
- Système de gestion du son amélioré avec bouton de contrôle
- Correction de divers bugs notamment dans la lecture automatique du son d'alerte
- Amélioration du support mobile et de la réactivité
- Détection automatique des changements d'écran
- Conception optimisée du code pour une meilleure performance

## Contact & Support

Pour toute question ou suggestion : [contact@tontonstudio.com](mailto:contact@tontonstudio.com)

Si vous trouvez cet outil utile, vous pouvez [m'offrir un café](https://www.paypal.com/donate/?business=RH4796JY56ZRE&no_recurring=0&item_name=Un+petit+caf%C3%A9+pour+mon+travail+?+%3A%29&currency_code=EUR) ☕

## Licence

© 2025 Tonton Studio - Tous droits réservés

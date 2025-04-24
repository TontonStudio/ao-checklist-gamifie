# AO Checklist - Tonton Studio (v2.5.2)

Outil de suivi gamifié de réponse aux marchés publics, inspiré par l'esthétique des jeux vidéo rétro de type Game Boy.

![Version](https://img.shields.io/badge/version-2.5.2-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Fonctionnalités

- **Interface rétro Game Boy** : Design 8-bit nostalgique inspiré des consoles portables classiques
- **Suivi des tâches** : Gestion intuitive de livrables et sous-tâches pour les appels d'offres
- **Gamification** : Effets visuels et sonores, animations lors de la complétion des tâches
- **Compte à rebours** : Suivi du temps restant jusqu'à la date limite de l'AO
- **Mode alerte** : Avertissement visuel et sonore quand il reste moins de 48h
- **Contrôle du son** : Possibilité de mettre en pause/reprendre le son d'alerte avec fade-out automatique
- **Copie des noms de fichier** : Facilité de copier les noms de fichiers formatés selon les exigences du marché
- **Personnalisation** : Chargement automatique d'un fichier tasks.js spécifique à chaque appel d'offres
- **Drag and Drop** : Possibilité de glisser-déposer le fichier tasks.js directement dans l'application
- **Barre de progression fixe** : La barre de progression reste visible lors du défilement
- **Badges "DONE!"** : Indicateurs visuels animés pour les tâches complétées
- **Sauvegarde locale** : Conservation de la progression entre les sessions
- **Création IA** : Génération du fichier tasks.js par notre GPT spécialisé
- **Interface responsive** : S'adapte aux différentes tailles d'écran
- **Haute performance** : Animations fluides et gestion efficace des ressources
- **Feux d'artifice améliorés** : Célébration plus spectaculaire en mode victoire

## Structure du projet

```
/__CHECKLIST__/
├── index.html              # Page principale
├── css/                    # Styles modulaires
│   ├── base.css            # Styles de base
│   ├── tasks.css           # Styles des tâches
│   ├── buttons.css         # Styles des boutons
│   ├── progress.css        # Styles de la barre de progression
│   ├── donate-block.css    # Styles du bloc de donation
│   ├── effects.css         # Styles des effets visuels
│   ├── modes.css           # Styles des modes (doré, warning)
│   ├── tasks-fix.css       # Correctifs pour les titres longs
│   ├── warning-override.css # Surcharge pour le mode warning
│   ├── responsive.css      # Styles adaptatifs
│   ├── welcome.css         # Styles de la page d'accueil
│   └── countdown.css       # Styles du compte à rebours
├── js/
│   ├── app.js              # Initialisation de l'application
│   ├── config.js           # Configuration globale
│   ├── utils.js            # Fonctions utilitaires
│   ├── sound-control.js    # Gestion du son
│   ├── countdown.js        # Gestion du compte à rebours
│   ├── effects.js          # Effets visuels et sonores
│   ├── tasks-manager.js    # Gestion des tâches
│   ├── fixed-progress-bar.js # Gestion de la barre de progression fixe
│   ├── sound-manager.js    # Gestion avancée du son
│   └── audio-engine.js     # Moteur audio
├── audio/
│   ├── check.mp3           # Son de cochage
│   ├── uncheck.mp3         # Son de décochage
│   ├── success.mp3         # Son de complétion
│   ├── finish.mp3          # Son de finalisation
│   └── warning.mp3         # Son d'avertissement
└── img/
    ├── TTS_Logo.png        # Logo standard
    ├── TTS_Logo_Checked.png # Logo activé (quand tout est complété)
    ├── tonton.png          # Avatar Tonton Studio
    └── mail.png            # Icône de mail en pixel art
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
3. Sélectionnez votre fichier tasks.js (chargement automatique)
4. Suivez votre progression en cochant les tâches accomplies
5. Un compte à rebours vous indique le temps restant avant la date limite
6. Lorsqu'il reste moins de 48h, un mode d'alerte visuel et sonore s'active
7. Cliquez sur le bouton son 🔊 pour couper/activer l'alerte sonore
8. Utilisez les boutons "Copier" pour récupérer les noms de fichiers standardisés
9. Quand toutes les tâches sont complétées, un mode "victoire" s'active avec des effets visuels

## Modes d'interface

- **Mode normal** : L'interface de base, inspirée de la Game Boy avec palette verte
- **Mode warning** : Activé automatiquement lorsqu'il reste moins de 48h, utilise une palette rouge
- **Mode doré** : Activé lorsque toutes les tâches sont complétées, avec effets spéciaux

## Nouveautés de la version 2.5.2 (Avril 2025)

- **Amélioration du contrôle du son** : Le bouton de son agit maintenant comme un bouton pause/play, conservant la position de lecture
- **Conservation de l'interface** : L'apparence du bouton reste inchangée (🔊/🔇) pour maintenir la cohérence visuelle
- **Correction de la barre de progression** : La barre de progression fixée conserve maintenant correctement son apparence lors du changement de listes de tâches
- **Transitions fluides entre modes** : Réinitialisation complète des styles lors du passage entre mode normal et warning

## Nouveautés de la version 2.5.1 (Avril 2025)

- **Amélioration de la lisibilité en mode warning** : Correction du fond d'affichage des noms de fichiers
- **Cohérence visuelle renforcée** : Les boutons "Copier" conservent une apparence uniforme pour toutes les tâches
- **Expérience utilisateur optimisée** : Meilleure visibilité des informations en mode warning

## Nouveautés de la version 2.5 (Améliorations UX et corrections de bugs)

- **Drag and drop natif** : Glissez-déposez votre fichier tasks.js directement depuis votre bureau
- **Feux d'artifice améliorés** : Plus nombreux et plus spectaculaires en mode victoire
- **Corrections visuelles** : Cohérence parfaite des couleurs en mode warning
- **Meilleure stabilité** : Correction des problèmes d'interaction avec la zone de drop
- **Expérience utilisateur optimisée** : Feedback visuel amélioré lors du glisser-déposer
- **Bordures uniformisées** : Cohérence visuelle complète dans tous les modes

## Génération automatique avec notre GPT spécialisé

Pour créer rapidement un fichier tasks.js parfaitement formaté, utilisez notre GPT dédié :

[🤖 **Tonton Studio - Gamified AO Checklist Generator**](https://chatgpt.com/g/g-680541e3745c8191b7bca4aa6861ad09-tonton-studio-gamified-ao-checklist-generator)

Il suffit de télécharger vos documents d'appel d'offres (RC, CCTP, etc.) et le GPT générera automatiquement un fichier tasks.js prêt à l'emploi, en suivant parfaitement le format requis.

## Installation

1. Clonez ce dépôt sur votre machine locale ou sur votre serveur :
   ```
   git clone https://github.com/tontonantonin/ao-checklist-gamifie.git
   ```

2. Ouvrez le fichier `index.html` dans votre navigateur web préféré.

3. Aucune installation supplémentaire ou dépendance n'est requise, l'application fonctionne directement dans votre navigateur.

## Déploiement

L'application peut être déployée sur n'importe quel hébergement statique (GitHub Pages, Netlify, Vercel, etc.) ou serveur web traditionnel. Il s'agit d'une application front-end pure sans dépendances côté serveur.

## Contact & Support

Pour toute question ou suggestion : [contact@tontonstudio.com](mailto:contact@tontonstudio.com)

Si vous trouvez cet outil utile, vous pouvez [m'offrir un café](https://www.paypal.com/donate/?business=RH4796JY56ZRE&no_recurring=0&item_name=Un+petit+caf%C3%A9+pour+mon+travail+?+%3A%29&currency_code=EUR) ☕

## Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations sur la façon de contribuer à ce projet.

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

© 2025 Tonton Studio
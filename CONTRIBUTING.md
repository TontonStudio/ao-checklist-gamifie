# Guide de contribution - AO Checklist v2.3

Merci de votre intérêt pour contribuer à notre projet ! Ce guide vous aidera à comprendre comment participer efficacement au développement de l'AO Checklist.

## Comment contribuer

1. **Fork** le projet
2. Créez une **branche** pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Ajout d'une fonctionnalité incroyable'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une **Pull Request**

## Architecture du projet

Le projet utilise une architecture modulaire :

- **HTML** : Structure principale dans `index.html`
- **CSS** : Styles répartis dans des fichiers thématiques dans `/css`
- **JavaScript** : Modules fonctionnels dans `/js`
- **Assets** : Ressources audio et images dans `/audio` et `/img`

### Structure CSS
Le projet utilise une architecture CSS modulaire où chaque fichier a une responsabilité spécifique :
- `base.css` : Styles fondamentaux et variables globales
- `tasks.css` : Styles spécifiques aux tâches et sous-tâches
- `progress.css` : Styles de la barre de progression
- `buttons.css` : Styles des boutons interactifs
- `effects.css` : Animations et effets visuels
- `modes.css` : Styles pour les modes golden et warning
- etc.

### Structure JavaScript
L'architecture JavaScript suit un modèle de modules fonctionnels :
- `app.js` : Point d'entrée principal et initialisation
- `config.js` : Configuration globale de l'application
- `utils.js` : Fonctions utilitaires partagées
- `tasks-manager.js` : Gestion des tâches et de la progression
- `fixed-progress-bar.js` : Logique de la barre de progression fixe
- `effects.js` : Effets visuels et animations
- `sound-control.js` : Gestion des effets sonores
- etc.

## Style de code

Pour maintenir la cohérence du code, suivez ces directives :

- Utiliser l'indentation à 2 espaces
- Suivre les conventions de nommage camelCase pour les variables et fonctions
- Utiliser des commentaires JSDoc pour documenter les fonctions
- Préfixer les propriétés privées avec un underscore (ex: `_privateVar`)
- Éviter les variables globales, privilégier les modules/objets encapsulés
- Utiliser APP_CONFIG pour les paramètres configurables
- Éviter les dépendances externes inutiles

### Conventions CSS

- Organisation par composants fonctionnels
- Utilisation de variables CSS (custom properties)
- Adopter une nomenclature cohérente pour les classes
- Maintenir l'esthétique Game Boy pour les éléments visuels
- Utiliser des préfixes pour indiquer les relations :
  - `task-*` pour les éléments liés aux tâches
  - `subtask-*` pour les éléments liés aux sous-tâches
  - `progress-*` pour les éléments liés à la progression

## Normes de commit

Format recommandé pour les messages de commit :
```
type(scope): description concise

Description détaillée si nécessaire
```

Types de commit :
- **feat** : nouvelle fonctionnalité
- **fix** : correction de bug
- **docs** : modification de documentation
- **style** : formatage (pas de changement de code)
- **refactor** : refactorisation du code
- **test** : ajout ou modification de tests
- **chore** : mise à jour des outils de build, etc.

## Signaler un bug

Avant de créer un rapport de bug, vérifiez si le problème n'a pas déjà été signalé. Si ce n'est pas le cas, incluez :

- Une description claire et concise du bug
- Les étapes pour reproduire le problème
- Le comportement attendu
- Des captures d'écran si nécessaire
- Votre environnement (OS, navigateur, version)

## Tester les changements

Avant de soumettre un PR, assurez-vous de tester votre code dans différentes conditions :

- Vérifiez le bon fonctionnement sur différents navigateurs (Chrome, Firefox, Safari)
- Testez l'interface sur différentes tailles d'écran (desktop, tablette, mobile)
- Vérifiez les cas limites (date passée, aucune tâche, etc.)
- Vérifiez que les fonctionnalités audio fonctionnent correctement
- Testez les cas particuliers:
  - Très longs titres de tâches
  - Grand nombre de sous-tâches
  - Défilement rapide de la page
  - Basculement entre modes normal, warning et golden

## Problèmes connus et défis techniques

Voici quelques domaines qui pourraient bénéficier d'améliorations :

1. **Gestion audio** : Certains navigateurs bloquent la lecture automatique du son, nécessitant une interaction utilisateur.
2. **Styles CSS complexes** : La combinaison des modes (normal, warning, golden) crée parfois des conflits de style.
3. **Z-index et superposition** : La barre de progression fixe et les badges peuvent parfois avoir des problèmes d'affichage.
4. **Performance du défilement** : L'utilisation de requestAnimationFrame améliore la performance mais peut encore être optimisée.
5. **Compatibilité navigateurs** : Certaines fonctionnalités CSS modernes comme `:has()` ne sont pas prises en charge par tous les navigateurs.

## Extension du projet

Si vous souhaitez ajouter de nouvelles fonctionnalités, considérez les extensions possibles :

1. Ajout de dates limites spécifiques pour chaque livrable
2. Mode multi-utilisateur avec synchronisation cloud
3. Export PDF de l'état d'avancement
4. Ajout de notes ou commentaires sur les tâches
5. Filtres pour voir uniquement les tâches à faire
6. Personnalisation des thèmes par l'utilisateur
7. Notifications pour rappeler les tâches en retard
8. Prise en charge multilingue
9. Estimation du temps nécessaire pour chaque tâche
10. Visualisations graphiques de l'avancement global

## Questions ?

Si vous avez des questions, n'hésitez pas à contacter l'équipe de Tonton Studio à [contact@tontonstudio.com](mailto:contact@tontonstudio.com).

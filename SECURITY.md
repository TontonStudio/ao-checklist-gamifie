# Politique de Sécurité

## Signalement d'une Vulnérabilité

La sécurité de notre application est une priorité. Si vous avez découvert une faille de sécurité dans AO Checklist, nous vous encourageons à nous en informer de manière responsable.

**Veuillez ne pas divulguer publiquement la vulnérabilité avant qu'elle n'ait été corrigée.**

Pour signaler une vulnérabilité, veuillez envoyer un e-mail à [contact@tontonstudio.com](mailto:contact@tontonstudio.com) avec les détails suivants :

- Description de la vulnérabilité
- Étapes pour reproduire le problème
- Versions affectées
- Impact potentiel
- Suggestions pour résoudre le problème (si vous en avez)

## Ce que nous faisons

Lorsque nous recevons un rapport de vulnérabilité, nous suivons ces étapes :

1. Nous confirmerons la réception de votre rapport dans les 48 heures
2. Nous évaluerons le rapport et déterminerons sa gravité
3. Nous développerons et testerons un correctif
4. Nous publierons une mise à jour avec le correctif
5. Nous reconnaîtrons votre contribution (si vous le souhaitez) dans nos notes de version

## Portée

Cette politique s'applique à tous les composants de l'application AO Checklist hébergée dans ce dépôt.

## Considérations de Sécurité

AO Checklist est une application entièrement côté client, ce qui signifie que :

- Aucune donnée utilisateur n'est envoyée à un serveur distant
- Toutes les données sont stockées localement dans le navigateur (localStorage)
- Il n'y a pas d'API ou de base de données côté serveur à compromettre

Cependant, comme pour toute application web, des problèmes potentiels peuvent exister, tels que :

- Vulnérabilités XSS lors du chargement de fichiers tasks.js personnalisés
- Problèmes liés aux bibliothèques tierces
- Problèmes liés au stockage local et à la persistance des données

## Meilleures Pratiques pour les Utilisateurs

Pour utiliser AO Checklist de manière sécurisée :

1. Utilisez toujours la dernière version de l'application
2. N'utilisez que des fichiers tasks.js provenant de sources fiables
3. Utilisez un navigateur moderne et à jour
4. Si vous déployez vous-même l'application, utilisez HTTPS

Nous apprécions votre aide pour maintenir AO Checklist sûr et fiable pour tous les utilisateurs.

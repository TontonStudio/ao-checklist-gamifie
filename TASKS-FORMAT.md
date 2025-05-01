# Guide du format tasks.json

Ce document explique comment créer un fichier `tasks.json` personnalisé pour l'application AO Checklist.

## Création assistée par notre GPT spécialisé (recommandé)

Pour générer facilement et précisément votre fichier tasks.json, nous avons développé un GPT spécialisé :

🤖 [**Tonton Studio - Gamified AO Checklist Generator**](https://chatgpt.com/g/g-680541e3745c8191b7bca4aa6861ad09-tonton-studio-gamified-ao-checklist-generator)

### Avantages de notre GPT spécialisé :

- **Analyse précise** : Il peut analyser directement vos documents d'appel d'offres (RC, CCTP, etc.)
- **Structure optimale** : Il génère un fichier tasks.json parfaitement formaté pour l'application
- **Exhaustivité** : Il s'assure de capturer tous les livrables et sous-tâches nécessaires
- **Conventions de nommage** : Il respecte les exigences de nommage de fichiers spécifiées dans l'AO

### Comment l'utiliser :

1. Accédez au GPT via le lien ci-dessus
2. Téléchargez vos documents d'appel d'offres (RC, CCTP, etc.)
3. Le GPT analysera les documents et vous proposera un fichier tasks.json prêt à l'emploi
4. Téléchargez le fichier généré et chargez-le dans l'application AO Checklist

C'est la méthode la plus rapide et la plus simple pour créer un fichier tasks.json sans erreur.

## Structure de base

Le fichier tasks.json contient deux éléments principaux dans un objet JSON :
1. L'objet **aoConfig** qui définit les paramètres généraux de l'appel d'offres
2. Le tableau **tasks** qui liste tous les livrables et sous-tâches à accomplir

## Configuration de l'appel d'offres (aoConfig)

L'objet `aoConfig` doit contenir les propriétés suivantes :

```json
{
  "aoConfig": {
    "title": "Titre de l'appel d'offres",
    "deadline": "2025-04-30T12:00:00",
    "reference": "REF-2025-001"
  },
  "tasks": []
}
```

- **title** : Titre complet de l'appel d'offres (s'affichera en haut de l'application)
- **deadline** : Date et heure limite au format ISO 8601 (YYYY-MM-DDThh:mm:ss)
- **reference** : Référence de l'appel d'offres (s'affichera dans le titre de la page)

## Structure des tâches (tasks)

Le tableau `tasks` contient une liste d'objets représentant chaque livrable :

```json
{
  "aoConfig": {
    "title": "Titre de l'appel d'offres",
    "deadline": "2025-04-30T12:00:00",
    "reference": "REF-2025-001"
  },
  "tasks": [
    {
      "label": "Nom du livrable",
      "filename": "Nom_fichier_global.pdf",
      "isMultiFile": false,
      "subtasks": [
        {
          "label": "Sous-tâche sans fichier"
        },
        {
          "label": "Sous-tâche avec fichier",
          "filename": "Nom_fichier_soustache.pdf"
        }
      ]
    }
  ]
}
```

Chaque objet dans le tableau `tasks` contient :
- **label** : Nom du livrable
- **filename** : Nom de fichier global du livrable (optionnel)
- **isMultiFile** : Indique si le livrable est composé de plusieurs fichiers distincts (true/false)
- **subtasks** : Liste des sous-tâches à accomplir pour ce livrable

## Exemples

### Exemple 1 : Dossier administratif (multi-fichiers)

```json
{
  "label": "Dossier administratif",
  "isMultiFile": true,
  "subtasks": [
    {
      "label": "Extrait K-bis",
      "filename": "Kbis.pdf"
    },
    {
      "label": "Déclaration sur l'honneur",
      "filename": "Declaration_honneur.pdf"
    },
    {
      "label": "DC1",
      "filename": "DC1.pdf"
    }
  ]
}
```

### Exemple 2 : Mémoire technique (fichier unique)

```json
{
  "label": "Mémoire technique",
  "filename": "Memoire_technique.pdf",
  "isMultiFile": false,
  "subtasks": [
    { "label": "Présentation de l'entreprise" },
    { "label": "Références similaires" },
    { "label": "Méthodologie proposée" },
    { "label": "Planning prévisionnel" }
  ]
}
```

## Exemple 3 : Document simple sans sous-tâches

```json
{
  "label": "Acte d'engagement",
  "filename": "Acte_Engagement.pdf",
  "isMultiFile": false,
  "subtasks": []
}
```

## Comportement des fichiers

- Si un livrable a `isMultiFile: true`, l'application affichera le message "Les fichiers individuels sont accessibles depuis chaque sous-tâche" lorsque le livrable est complété.
- Si un livrable a une propriété `filename` et n'est pas multi-fichier, le nom du fichier global s'affichera avec un bouton "Copier" lorsque le livrable est complété.
- Si une sous-tâche a une propriété `filename`, le nom du fichier s'affichera sous le libellé de la sous-tâche avec un bouton "Copier".

## Bonnes pratiques

- Utilisez des noms explicites pour les livrables et sous-tâches
- Respectez les conventions de nommage des fichiers demandées dans l'appel d'offres
- Évitez les caractères spéciaux dans les noms de fichiers
- Structurez les livrables de manière logique et cohérente
- Limitez le nombre de sous-tâches par livrable pour garder l'interface lisible
- Assurez-vous que votre JSON est valide (sans virgules superflues, guillemets manquants, etc.)
- Pour les documents simples qui n'ont pas besoin de sous-tâches, vous pouvez utiliser un tableau `subtasks` vide `[]`

## Exemple complet

```json
{
  "aoConfig": {
    "title": "Mission d'assistance à Maîtrise d'ouvrage",
    "deadline": "2025-04-30T12:00:00",
    "reference": "AO-2025-123"
  },
  "tasks": [
    {
      "label": "Dossier administratif",
      "isMultiFile": true,
      "subtasks": [
        { "label": "Extrait K-bis", "filename": "Kbis.pdf" },
        { "label": "Attestation fiscale", "filename": "Attestation_fiscale.pdf" },
        { "label": "Attestation sociale", "filename": "Attestation_sociale.pdf" }
      ]
    },
    {
      "label": "Offre technique",
      "filename": "Offre_technique.pdf",
      "isMultiFile": false,
      "subtasks": [
        { "label": "Méthodologie" },
        { "label": "Moyens humains" },
        { "label": "Planning" }
      ]
    },
    {
      "label": "Offre financière",
      "filename": "Offre_financiere.pdf",
      "isMultiFile": false,
      "subtasks": [
        { "label": "Devis détaillé" }
      ]
    }
  ]
}
```

## Validation de votre JSON

Pour vous assurer que votre fichier tasks.json est valide, vous pouvez utiliser un validateur JSON en ligne comme [JSONLint](https://jsonlint.com/) ou des extensions pour éditeurs de code comme Visual Studio Code qui valident automatiquement la syntaxe JSON.

## Conversion depuis un ancien format tasks.js

Si vous avez des fichiers existants au format tasks.js, vous devez les convertir en format JSON avec la structure suivante :

```json
{
  "aoConfig": {
    // Contenu de votre ancien objet aoConfig
  },
  "tasks": [
    // Contenu de votre ancien tableau tasks
  ]
}
```

Notre GPT spécialisé peut également vous aider à convertir vos anciens fichiers tasks.js en nouveau format tasks.json.

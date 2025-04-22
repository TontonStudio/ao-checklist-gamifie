# Guide du format tasks.js

Ce document explique comment créer un fichier `tasks.js` personnalisé pour l'application AO Checklist.

## Structure de base

Le fichier tasks.js contient deux éléments principaux :
1. L'objet **aoConfig** qui définit les paramètres généraux de l'appel d'offres
2. Le tableau **tasks** qui liste tous les livrables et sous-tâches à accomplir

## Configuration de l'appel d'offres (aoConfig)

L'objet `aoConfig` doit contenir les propriétés suivantes :

```javascript
const aoConfig = {
  // Titre complet de l'appel d'offres (s'affichera en haut de l'application)
  title: "Titre de l'appel d'offres",
  
  // Date et heure limite au format ISO 8601 (YYYY-MM-DDThh:mm:ss)
  deadline: "2025-04-30T12:00:00",
  
  // Référence de l'appel d'offres (s'affichera dans le titre de la page)
  reference: "REF-2025-001"
};
```

## Structure des tâches (tasks)

Le tableau `tasks` contient une liste d'objets représentant chaque livrable :

```javascript
const tasks = [
  {
    // Nom du livrable
    label: "Nom du livrable",
    
    // Nom de fichier global du livrable (optionnel)
    filename: "Nom_fichier_global.pdf",
    
    // Indique si le livrable est composé de plusieurs fichiers distincts
    isMultiFile: false, // ou true pour les livrables multi-fichiers
    
    // Liste des sous-tâches à accomplir pour ce livrable
    subtasks: [
      // Sous-tâche simple sans fichier associé
      { label: "Sous-tâche sans fichier" },
      
      // Sous-tâche avec fichier associé
      { 
        label: "Sous-tâche avec fichier",
        filename: "Nom_fichier_soustache.pdf"
      }
    ]
  }
];
```

## Exemples

### Exemple 1 : Dossier administratif (multi-fichiers)

```javascript
{
  label: "Dossier administratif",
  isMultiFile: true,  // Plusieurs fichiers distincts
  subtasks: [
    { 
      label: "Extrait K-bis",
      filename: "Kbis.pdf"
    },
    { 
      label: "Déclaration sur l'honneur",
      filename: "Declaration_honneur.pdf"
    },
    { 
      label: "DC1",
      filename: "DC1.pdf"
    }
  ]
}
```

### Exemple 2 : Mémoire technique (fichier unique)

```javascript
{
  label: "Mémoire technique",
  filename: "Memoire_technique.pdf",
  isMultiFile: false,
  subtasks: [
    { label: "Présentation de l'entreprise" },
    { label: "Références similaires" },
    { label: "Méthodologie proposée" },
    { label: "Planning prévisionnel" }
  ]
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

## Exemple complet

```javascript
// Configuration globale de l'appel d'offres
const aoConfig = {
  title: "Mission d'assistance à Maîtrise d'ouvrage",
  deadline: "2025-04-30T12:00:00",
  reference: "AO-2025-123"
};

const tasks = [
  {
    label: "Dossier administratif",
    isMultiFile: true,
    subtasks: [
      { label: "Extrait K-bis", filename: "Kbis.pdf" },
      { label: "Attestation fiscale", filename: "Attestation_fiscale.pdf" },
      { label: "Attestation sociale", filename: "Attestation_sociale.pdf" }
    ]
  },
  {
    label: "Offre technique",
    filename: "Offre_technique.pdf",
    isMultiFile: false,
    subtasks: [
      { label: "Méthodologie" },
      { label: "Moyens humains" },
      { label: "Planning" }
    ]
  },
  {
    label: "Offre financière",
    filename: "Offre_financiere.pdf",
    isMultiFile: false,
    subtasks: [
      { label: "Devis détaillé" }
    ]
  }
];
```

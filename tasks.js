const tasks = [
  {
    label: 'Candidature administrative',
    filename: 'DossierAdmin_TontonStudio.zip', // Dossier global (optionnel)
    subtasks: [
      { label: 'Remplir DC1', filename: 'DC1_TontonStudio.pdf' },
      { label: 'Remplir DC2', filename: 'DC2_TontonStudio.pdf' },
      { label: 'Déclaration sur l\'honneur', filename: 'Declaration_TontonStudio.pdf' },
      { label: 'Références professionnelles', filename: 'References_TontonStudio.pdf' }
    ]
  },
  {
    label: 'Mémoire technique',
    filename: 'MemoireTechnique_TontonStudio.pdf',
    subtasks: [
      { label: 'Présentation de l\'entreprise' }, // Pas de filename = tâche interne
      { label: 'Compréhension du besoin' },
      { label: 'Méthodologie proposée' },
      { label: 'Moyens humains dédiés' },
      { label: 'Planning prévisionnel' }
    ]
  },
  {
    label: 'Offre financière',
    filename: 'OffreFinanciere_TontonStudio.pdf',
    subtasks: [
      { label: 'Détail des prix unitaires', filename: 'DetailPrix_TontonStudio.pdf' },
      { label: 'Bordereau des prix', filename: 'BordereauPrix_TontonStudio.pdf' },
      { label: 'Devis détaillé', filename: 'Devis_TontonStudio.pdf' },
      { label: 'Conditions de paiement' }
    ]
  },
  {
    label: 'Portfolio de références',
    filename: 'Portfolio_TontonStudio.pdf',
    subtasks: [
      { label: 'Sélection de projets similaires' },
      { label: 'Résultats et retours clients' },
      { label: 'Équipe ayant travaillé sur les projets' },
      { label: 'Technologies utilisées' }
    ]
  },
  {
    label: 'Documents complémentaires',
    filename: 'Annexes_TontonStudio.zip',
    subtasks: [
      { label: 'Certifications et agréments', filename: 'Certifications_TontonStudio.pdf' },
      { label: 'Attestations d\'assurance', filename: 'Assurances_TontonStudio.pdf' },
      { label: 'CV des intervenants clés', filename: 'CV_TontonStudio.pdf' },
      { label: 'Calendrier détaillé', filename: 'Calendrier_TontonStudio.pdf' }
    ]
  }
];

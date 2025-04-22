// Configuration globale de l'appel d'offres
const aoConfig = {
  title: "Mission d'assistance à Maîtrise d'ouvrage dans la mise en place d'un dispositif d'open badges sur le territoire de Bordeaux Métropole",
  deadline: "2025-04-18T12:00:00",
  reference: "2025-FAAM-0024"
};

const tasks = [
  {
    label: "Dossier de candidature",
    filename: "Candidature_OpenBadges.pdf",
    subtasks: [
      { label: "DC1 complété et signé", filename: "DC1.pdf" },
      { label: "DC2 complété", filename: "DC2.pdf" },
      { label: "Déclaration sur l'honneur de non-exclusion", filename: "Declaration_Honneur.pdf" },
      { label: "Déclaration respect droit social et environnemental", filename: "Declaration_Social_Env.pdf" },
      { label: "Références professionnelles des 3 dernières années", filename: "References.pdf" },
      { label: "Questionnaire Égalité / Diversité (format Word)", filename: "Questionnaire_Egalite_FH.docx" }
    ]
  },
  {
    label: "Offre technique",
    filename: "Offre_Technique_OpenBadges.pdf",
    subtasks: [
      { label: "Mémoire technique (méthodologie, moyens humains...)", filename: "Memoire_Technique.pdf" },
      { label: "CV des intervenants", filename: "CV_Intervenants.pdf" },
      { label: "Exemples de livrables ou restitutions similaires", filename: "Exemples_Livrables.pdf" }
    ]
  },
  {
    label: "Offre financière",
    filename: "Offre_Financiere_OpenBadges.pdf",
    subtasks: [
      { label: "Acte d'engagement (AE) signé", filename: "Acte_Engagement.pdf" },
      { label: "Décomposition du prix global forfaitaire (DPGF)", filename: "DPGF.xlsx" }
    ]
  },
  {
    label: "Pièces liées au RGPD",
    filename: "Conformite_RGPD_OpenBadges.pdf",
    subtasks: [
      { label: "Annexe RGPD au CCAP signée", filename: "Annexe_RGPD_CCAP.pdf" },
      { label: "Cadre de réponse RGPD (Excel)", filename: "Cadre_Reponse_RGPD.xlsx" }
    ]
  }
];
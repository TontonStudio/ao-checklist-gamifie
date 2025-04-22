// Configuration globale de l'appel d'offres
const aoConfig = {
  title: "Mission d'assistance à Maîtrise d'ouvrage dans la mise en place d'un dispositif d'open badges sur le territoire de Bordeaux Métropole et prestations associées",
  deadline: "2025-04-22T12:00:00",
  reference: "2025-FAAM-0024"
};

const tasks = [
  {
    label: "Dossier administratif",
    isMultiFile: true,
    subtasks: [
      {
        label: "Extrait K-bis",
        filename: "Kbis.pdf"
      },
      {
        label: "Déclaration sur l'honneur",
        filename: "Attestation_Honneur.pdf"
      },
      {
        label: "Formulaire DC1",
        filename: "DC1.pdf"
      },
      {
        label: "Formulaire DC2",
        filename: "DC2.pdf"
      }
    ]
  },
  {
    label: "Mémoire technique",
    filename: "Memoire_Technique.pdf",
    isMultiFile: false,
    subtasks: [
      { label: "Moyens humains mis à disposition (qualifications, expériences, disponibilités)" },
      { label: "CV des profils proposés" },
      { label: "Organisation, méthodologie et outils pour chaque type de prestation" },
      { label: "Exemples de livrables ou restitutions similaires" }
    ]
  },
  {
    label: "Cadre de réponse RGPD",
    filename: "Cadre_RGPD.xlsx",
    isMultiFile: false,
    subtasks: [
      { label: "Description des traitements de données" },
      { label: "Engagements de conformité RGPD" }
    ]
  },
  {
    label: "Décomposition du prix global forfaitaire (DPGF)",
    filename: "DPGF.xlsx",
    isMultiFile: false,
    subtasks: [
      { label: "Prix détaillé par mission et phase" }
    ]
  },
  {
    label: "Questionnaire égalité / diversité (Annexe RC)",
    filename: "Annexe_Egalite_Diversite.docx",
    isMultiFile: false,
    subtasks: [
      { label: "Politique en matière d'égalité et diversité" },
      { label: "Sensibilisation et formation du personnel" },
      { label: "Communication sur les engagements" }
    ]
  }
];
/**
 * Configuration globale de l'application
 */
const APP_CONFIG = {
  // Mode debug (affichage des logs dans la console)
  debug: false,
  // Clé de stockage local
  storageKey: 'tontonAoProgress',
  
  // Paramètres pour le compteur à rebours
  countdown: {
    warningThreshold: 48, // Heures restantes avant d'afficher l'avertissement
    updateInterval: 1000 // Intervalle de mise à jour du compteur (en ms)
  },
  
  // Paramètres pour les effets visuels
  effects: {
    particleCount: 50, // Nombre de particules pour l'effet de complétion
    fireworkInterval: 1500 // Intervalle entre les feux d'artifice (en ms)
  },
  
  // Messages
  messages: {
    countdownWarning: "Il reste moins de 48h pour répondre ! Ce n'est pas idéal...",
    deadlineExpired: "Le délai est expiré !",
    fileError: "Format de fichier non valide. Veuillez charger un fichier tasks.js valide.",
    resetConfirm: "Êtes-vous sûr de vouloir réinitialiser toute la progression ?",
    returnHomeConfirm: "Êtes-vous sûr de vouloir revenir à l'accueil ? Les tâches actuelles seront supprimées."
  }
};

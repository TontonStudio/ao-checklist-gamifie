/**
 * Utilitaire de logging pour l'application
 * Permet d'activer/désactiver facilement les logs en fonction du mode debug
 */
const Logger = {
  /**
   * Affiche un message de log standard
   * @param {...any} args - Arguments à logger
   */
  log: function(...args) {
    if (APP_CONFIG.debug) {
      console.log(...args);
    }
  },
  
  /**
   * Affiche un message d'avertissement
   * @param {...any} args - Arguments à logger
   */
  warn: function(...args) {
    if (APP_CONFIG.debug) {
      console.warn(...args);
    }
  },
  
  /**
   * Affiche un message d'erreur (toujours affiché, même en mode production)
   * @param {...any} args - Arguments à logger
   */
  error: function(...args) {
    // Les erreurs sont toujours affichées
    console.error(...args);
  }
};

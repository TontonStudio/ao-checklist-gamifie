/**
 * Gestion du compte à rebours et du mode warning
 */
const CountdownManager = {
  interval: null,
  warningActive: false,
  // Mise en cache des éléments DOM pour éviter les requêtes répétées
  elements: {
    container: null,
    timer: null,
    message: null
  },
  // Cache des éléments pour les changements de mode
  gameContainers: null,
  countdownElements: null,
  lastUpdate: 0,
  
  /**
   * Initialise le gestionnaire de compte à rebours
   */
  init: function() {
    // Mettre en cache les éléments DOM fréquemment utilisés
    this.elements.container = document.getElementById('countdown-container');
    this.elements.timer = document.getElementById('countdown-timer');
    this.elements.message = document.getElementById('countdown-message');
    
    // Mettre en cache des collections d'éléments pour les changements de mode
    this.gameContainers = document.querySelectorAll('.gameboy-container');
    this.countdownElements = document.querySelectorAll('.countdown-container, .countdown-message, .countdown-timer');
    
    // Utiliser un attribut data pour passer des états entre CSS et JS
    document.body.setAttribute('data-countdown-init', 'true');
  },
  
  /**
   * Démarre le compte à rebours
   * @param {Date} deadline - Date limite
   */
  startCountdown: function(deadline) {
    // Initialiser les éléments si ce n'est pas déjà fait
    if (!this.elements.container) {
      this.init();
    }
    
    const { container, timer, message } = this.elements;
    
    // Vérifier que les éléments DOM existent
    if (!container || !timer || !message) {
      if (APP_CONFIG.debug) {
        console.error("Éléments DOM de compte à rebours non trouvés");
      }
      return;
    }
    
    // S'assurer que le conteneur du compte à rebours est visible
    container.style.display = 'block';
    
    // Réinitialiser l'état précédent
    this.warningActive = false;
    
    // Réinitialiser explicitement tous les éléments liés au mode warning en une seule manipulation
    requestAnimationFrame(() => {
      document.body.classList.remove('warning-mode');
      document.body.setAttribute('data-warning-mode', 'false');
      
      this.gameContainers.forEach(el => {
        el.classList.remove('warning-mode');
      });
      
      this.countdownElements.forEach(el => {
        el.classList.remove('warning-mode', 'countdown-warning');
      });
      
      message.textContent = '';
    });
    
    // Désactiver le mode warning dans le contrôleur de son
    if (typeof SoundControl !== 'undefined') {
      SoundControl.deactivateWarningMode();
    }
    
    // Nettoyer tout intervalle existant
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    /**
     * Fonction de mise à jour du compte à rebours optimisée
     * Utilise throttling pour limiter les mises à jour fréquentes
     */
    const updateCountdown = () => {
      const now = Date.now();
      
      // Limiter les mises à jour pour éviter les surcharges inutiles
      // 100ms est un bon équilibre entre fluidité et performance
      if (now - this.lastUpdate < 100) {
        return;
      }
      
      this.lastUpdate = now;
      
      const timeRemaining = Utils.formatTimeRemaining(deadline);
      
      // Si le temps est écoulé, afficher 00:00:00
      if (timeRemaining.total <= 0) {
        timer.textContent = '00j 00h 00m 00s';
        message.textContent = APP_CONFIG.messages.deadlineExpired;
        
        // Utiliser requestAnimationFrame pour les changements visuels
        requestAnimationFrame(() => {
          message.classList.add('countdown-warning');
          this.activateWarningMode();
        });
        
        // Arrêter l'intervalle
        clearInterval(this.interval);
        return;
      }
      
      // Formatage avec leading zeros pour éviter les sauts d'interface
      const days = String(timeRemaining.days).padStart(2, '0');
      const hours = String(timeRemaining.hours).padStart(2, '0');
      const minutes = String(timeRemaining.minutes).padStart(2, '0');
      const seconds = String(timeRemaining.seconds).padStart(2, '0');
      
      // Mise à jour du timer
      // Vérifier si l'affichage a réellement changé pour éviter les mises à jour inutiles
      const newText = `${days}j ${hours}h ${minutes}m ${seconds}s`;
      if (timer.textContent !== newText) {
        timer.textContent = newText;
      }
      
      // Vérifier si on est dans la période d'avertissement (moins de 48h)
      const totalHoursLeft = timeRemaining.days * 24 + timeRemaining.hours;
      
      if (totalHoursLeft < APP_CONFIG.countdown.warningThreshold) {
        // Afficher l'avertissement si pas déjà actif
        if (!this.warningActive) {
          this.activateWarningMode();
        }
      } else {
        // Désactiver le mode d'avertissement si actif
        if (this.warningActive) {
          this.deactivateWarningMode();
        }
      }
    };
    
    // Mettre à jour immédiatement
    updateCountdown();
    
    // Utiliser un intervalle plus long pour réduire la charge CPU
    this.interval = setInterval(updateCountdown, APP_CONFIG.countdown.updateInterval);
  },
  
  /**
   * Active le mode d'avertissement (moins de 48h)
   */
  activateWarningMode: function() {
    // Si déjà actif, ne rien faire
    if (this.warningActive) return;
    
    const { container, message } = this.elements;
    
    // Utiliser requestAnimationFrame pour grouper les changements visuels
    requestAnimationFrame(() => {
      // Utiliser des attributs data pour CSS
      document.body.setAttribute('data-warning-mode', 'true');
      
      // Appliquer les classes CSS
      container.classList.add('warning-mode');
      message.textContent = APP_CONFIG.messages.countdownWarning;
      message.classList.add('countdown-warning');
      
      // Ajouter un effet visuel d'urgence sur toute l'application
      document.body.classList.add('warning-mode');
      
      // Appliquer la classe warning-mode à tous les conteneurs pertinents
      this.gameContainers.forEach(el => {
        el.classList.add('warning-mode');
      });
    });
    
    // Marquer le mode avertissement comme actif
    this.warningActive = true;
    
    // Activer le mode warning dans le contrôleur de son
    if (typeof SoundControl !== 'undefined') {
      SoundControl.activateWarningMode();
    }
  },
  
  /**
   * Désactive le mode d'avertissement
   */
  deactivateWarningMode: function() {
    // Si déjà inactif, ne rien faire
    if (!this.warningActive) return;
    
    const { container, message } = this.elements;
    
    // Utiliser requestAnimationFrame pour grouper les changements visuels
    requestAnimationFrame(() => {
      // Utiliser des attributs data pour CSS
      document.body.setAttribute('data-warning-mode', 'false');
      
      // Nettoyer tous les éléments UI liés au mode warning
      container.classList.remove('warning-mode');
      message.textContent = '';
      message.classList.remove('countdown-warning');
      
      // Assurer que tous les autres éléments de countdown sont aussi nettoyés
      document.querySelectorAll('.countdown-timer').forEach(element => {
        element.classList.remove('warning-mode', 'countdown-warning');
      });
      
      // Retirer l'effet visuel d'urgence de tous les éléments
      document.body.classList.remove('warning-mode');
      
      // Optimisation pour éviter les multiples requêtes querySelector
      this.gameContainers.forEach(el => {
        el.classList.remove('warning-mode');
      });
    });
    
    // Marquer le mode avertissement comme inactif
    this.warningActive = false;
    
    // Désactiver le mode warning dans le contrôleur de son
    if (typeof SoundControl !== 'undefined') {
      SoundControl.deactivateWarningMode();
    }
  }
};

// Initialisation différée pour ne pas bloquer le rendu initial
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => CountdownManager.init(), 100);
  });
} else {
  setTimeout(() => CountdownManager.init(), 100);
}
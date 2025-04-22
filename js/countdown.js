/**
 * Gestion du compte à rebours et du mode warning
 */
const CountdownManager = {
  interval: null,
  warningActive: false,
  
  /**
   * Démarre le compte à rebours
   * @param {Date} deadline - Date limite
   */
  startCountdown: function(deadline) {
    const countdownContainer = document.getElementById('countdown-container');
    const countdownTimer = document.getElementById('countdown-timer');
    const countdownMessage = document.getElementById('countdown-message');
    
    // Vérifier que les éléments DOM existent
    if (!countdownContainer || !countdownTimer || !countdownMessage) {
      console.error("Éléments DOM de compte à rebours non trouvés");
      return;
    }
    
    if (APP_CONFIG.debug) console.log("Démarrage du compte à rebours pour :", deadline);
    
    // S'assurer que le conteneur du compte à rebours est visible
    countdownContainer.style.display = 'block';
    
    // Réinitialiser l'état précédent
    this.warningActive = false;
    
    // Réinitialiser explicitement tous les éléments liés au mode warning
    document.body.classList.remove('warning-mode');
    document.querySelectorAll('.gameboy-container').forEach(container => {
      container.classList.remove('warning-mode');
    });
    document.querySelectorAll('.countdown-container, .countdown-message, .countdown-timer').forEach(element => {
      element.classList.remove('warning-mode', 'countdown-warning');
    });
    
    countdownMessage.textContent = '';
    
    // Désactiver le mode warning dans le contrôleur de son
    if (typeof SoundControl !== 'undefined') {
      SoundControl.deactivateWarningMode();
    }
    
    // Nettoyer tout intervalle existant
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    // Fonction de mise à jour du compte à rebours
    const updateCountdown = () => {
      const timeRemaining = Utils.formatTimeRemaining(deadline);
      
      // Si le temps est écoulé, afficher 00:00:00
      if (timeRemaining.total <= 0) {
        countdownTimer.textContent = '00j 00h 00m 00s';
        countdownMessage.textContent = APP_CONFIG.messages.deadlineExpired;
        countdownMessage.classList.add('countdown-warning');
        
        // Activer le mode d'avertissement pour un délai expiré
        this.activateWarningMode(countdownContainer, countdownMessage);
        
        // Arrêter l'intervalle
        clearInterval(this.interval);
        return;
      }
      
      // Formatage avec leading zeros
      const days = String(timeRemaining.days).padStart(2, '0');
      const hours = String(timeRemaining.hours).padStart(2, '0');
      const minutes = String(timeRemaining.minutes).padStart(2, '0');
      const seconds = String(timeRemaining.seconds).padStart(2, '0');
      
      // Mise à jour du timer
      countdownTimer.textContent = `${days}j ${hours}h ${minutes}m ${seconds}s`;
      
      // Vérifier si on est dans la période d'avertissement (moins de 48h)
      const totalHoursLeft = timeRemaining.days * 24 + timeRemaining.hours;
      
      if (APP_CONFIG.debug) console.log("Temps restant:", totalHoursLeft, "heures (seuil:", APP_CONFIG.countdown.warningThreshold, "h)");
      
      if (totalHoursLeft < APP_CONFIG.countdown.warningThreshold) {
        // Afficher l'avertissement si pas déjà actif
        if (!this.warningActive) {
          this.activateWarningMode(countdownContainer, countdownMessage);
        }
      } else {
        // Désactiver le mode d'avertissement si actif
        if (this.warningActive) {
          this.deactivateWarningMode(countdownContainer, countdownMessage);
        }
      }
    };
    
    // Mettre à jour immédiatement puis à l'intervalle défini
    updateCountdown();
    this.interval = setInterval(updateCountdown, APP_CONFIG.countdown.updateInterval);
  },
  
  /**
   * Active le mode d'avertissement (moins de 48h)
   * @param {HTMLElement} container - Conteneur du compte à rebours
   * @param {HTMLElement} message - Élément du message
   */
  activateWarningMode: function(container, message) {
    if (APP_CONFIG.debug) console.log("Activation du mode d'avertissement");
    
    // Appliquer les classes CSS
    container.classList.add('warning-mode');
    message.textContent = APP_CONFIG.messages.countdownWarning;
    message.classList.add('countdown-warning');
    
    // Marquer le mode avertissement comme actif
    this.warningActive = true;
    
    // Ajouter un effet visuel d'urgence sur toute l'application
    document.body.classList.add('warning-mode');
    
    // Appliquer la classe warning-mode à tous les conteneurs pertinents
    document.querySelectorAll('.gameboy-container').forEach(container => {
      container.classList.add('warning-mode');
    });
    
    // Activer le mode warning dans le contrôleur de son
    if (typeof SoundControl !== 'undefined') {
      SoundControl.activateWarningMode();
    }
  },
  
  /**
   * Désactive le mode d'avertissement
   * @param {HTMLElement} container - Conteneur du compte à rebours
   * @param {HTMLElement} message - Élément du message
   */
  deactivateWarningMode: function(container, message) {
    if (APP_CONFIG.debug) console.log("Désactivation du mode d'avertissement");
    
    // Nettoyer tous les éléments UI liés au mode warning
    container.classList.remove('warning-mode');
    message.textContent = '';
    message.classList.remove('countdown-warning');
    
    // Assurer que tous les autres éléments de countdown sont aussi nettoyés
    document.querySelectorAll('.countdown-timer').forEach(element => {
      element.classList.remove('warning-mode', 'countdown-warning');
    });
    
    // Marquer le mode avertissement comme inactif
    this.warningActive = false;
    
    // Retirer l'effet visuel d'urgence de tous les éléments
    document.body.classList.remove('warning-mode');
    
    document.querySelectorAll('.gameboy-container').forEach(container => {
      container.classList.remove('warning-mode');
    });
    
    // Désactiver le mode warning dans le contrôleur de son
    if (typeof SoundControl !== 'undefined') {
      SoundControl.deactivateWarningMode();
    }
  }
};

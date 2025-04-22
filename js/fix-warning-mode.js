/**
 * Vérification du mode warning et activation automatique
 * Ce script vérifie si le mode warning devrait être activé et force son activation si nécessaire
 */
document.addEventListener('DOMContentLoaded', function() {
  // Exécuter après un court délai pour s'assurer que tout est chargé
  setTimeout(function() {
    if (APP_CONFIG.debug) console.log("Vérification du mode warning...");
    
    // Vérifier si une date limite existe et si on est sur l'écran de checklist
    if (window.aoConfig && window.aoConfig.deadline) {
      const checklistScreen = document.getElementById('checklist-screen');
      if (!checklistScreen || checklistScreen.style.display === 'none') {
        if (APP_CONFIG.debug) console.log("Pas sur l'écran de checklist, pas d'activation du mode warning");
        return;
      }
      
      const deadline = new Date(window.aoConfig.deadline);
      const now = new Date();
      const diffHours = (deadline - now) / (1000 * 60 * 60);
      
      if (APP_CONFIG.debug) {
        console.log("Temps restant avant échéance:", diffHours.toFixed(2), "heures");
        console.log("Seuil d'avertissement:", APP_CONFIG.countdown.warningThreshold, "heures");
      }
      
      // Vérifier si on devrait être en mode warning
      if (diffHours < APP_CONFIG.countdown.warningThreshold) {
        if (APP_CONFIG.debug) console.log("Le mode warning devrait être activé!");
        
        // Forcer l'activation du mode warning si ce n'est pas déjà fait
        if (!CountdownManager.warningActive) {
          if (APP_CONFIG.debug) console.log("Activation forcée du mode warning...");
          const countdownContainer = document.getElementById('countdown-container');
          const countdownMessage = document.getElementById('countdown-message');
          
          if (countdownContainer && countdownMessage) {
            // Forcer l'activation du mode warning
            CountdownManager.activateWarningMode(countdownContainer, countdownMessage);
          }
          
          // S'assurer que tous les éléments ont la classe warning-mode
          document.body.classList.add('warning-mode');
          document.querySelectorAll('.gameboy-container').forEach(container => {
            container.classList.add('warning-mode');
          });
        }
      }
    }
  }, 800); // Délai pour s'assurer que tout est initialisé
});

// Observer les changements d'écran pour afficher/masquer le bouton de son
window.addEventListener('load', function() {
  // Observer les changements de display sur l'écran de checklist
  const checklistScreen = document.getElementById('checklist-screen');
  const welcomeScreen = document.getElementById('welcome-screen');
  
  if (checklistScreen && welcomeScreen) {
    // Surveiller les changements d'affichage de l'écran de checklist
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'style') {
          const isVisible = checklistScreen.style.display !== 'none';
          
          // Si l'écran de checklist devient visible et qu'on est en mode warning
          if (isVisible && CountdownManager.warningActive) {
            if (APP_CONFIG.debug) console.log("Écran de checklist affiché avec mode warning actif");
            if (typeof SoundControl !== 'undefined') {
              SoundControl.showSoundButton();
              
              // Plusieurs tentatives pour jouer le son
              setTimeout(() => SoundControl.playWarningSound(), 100);
              setTimeout(() => SoundControl.playWarningSound(), 500);
            }
          } 
          // Si l'écran de checklist devient invisible, masquer le bouton de son
          else if (!isVisible && typeof SoundControl !== 'undefined') {
            SoundControl.hideSoundButton();
          }
        }
      });
    });
    
    // Observer les changements d'attribut style
    observer.observe(checklistScreen, { attributes: true, attributeFilter: ['style'] });
    observer.observe(welcomeScreen, { attributes: true, attributeFilter: ['style'] });
  }
});

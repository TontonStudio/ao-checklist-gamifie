/**
 * Contrôleur de son centralisé
 * Gère la lecture et la mise en sourdine des sons d'avertissement
 */
const SoundControl = {
  // État du son (désactivé ou non)
  muted: false,
  
  // Référence à l'élément audio d'avertissement
  warningSound: document.getElementById('warning-sound'),
  
  // Référence au bouton de contrôle
  soundButton: document.getElementById('sound-toggle'),
  
  // Clé pour le localStorage
  STORAGE_KEY: 'tontonAoMusicMuted',
  
  // État actif de la musique d'avertissement
  warningActive: false,
  
  /**
   * Initialise le contrôleur de son
   */
  init: function() {
    if (APP_CONFIG.debug) console.log("Initialisation du contrôleur de son");
    
    // Charger l'état du son depuis localStorage
    this.loadMuteState();
    
    // Configurer le bouton de contrôle du son s'il existe
    if (this.soundButton) {
      // Masquer le bouton initialement
      this.soundButton.style.display = 'none';
      
      // Mettre à jour l'apparence selon l'état du son
      this.updateButtonAppearance();
      
      // Ajouter un gestionnaire d'événement pour le clic
      this.soundButton.addEventListener('click', () => {
        this.toggleMute();
      });
    }
  },
  
  /**
   * Charge l'état du son depuis localStorage
   */
  loadMuteState: function() {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState !== null) {
      this.muted = savedState === 'true';
    }
    if (APP_CONFIG.debug) console.log("État du son chargé:", this.muted ? "muet" : "actif");
  },
  
  /**
   * Sauvegarde l'état du son dans localStorage
   */
  saveMuteState: function() {
    localStorage.setItem(this.STORAGE_KEY, this.muted);
    if (APP_CONFIG.debug) console.log("État du son sauvegardé:", this.muted ? "muet" : "actif");
  },
  
  /**
   * Met à jour l'apparence du bouton de son
   */
  updateButtonAppearance: function() {
    if (!this.soundButton) return;
    
    // Mettre à jour l'icône et le titre
    this.soundButton.textContent = this.muted ? '🔇' : '🔊';
    this.soundButton.title = this.muted ? 'Activer le son' : 'Couper le son';
    
    // Ajouter/supprimer l'attribut data-muted pour le style CSS
    this.soundButton.setAttribute('data-muted', this.muted);
  },
  
  /**
   * Active ou désactive le son
   */
  toggleMute: function() {
    // Inverser l'état du son
    this.muted = !this.muted;
    
    // Sauvegarder le nouvel état
    this.saveMuteState();
    
    // Mettre à jour l'apparence du bouton
    this.updateButtonAppearance();
    
    // Appliquer l'état du son
    if (this.muted) {
      // Si on désactive le son, arrêter la musique
      this.stopWarningSound();
    } else if (this.warningActive) {
      // Si on active le son et qu'on est en mode warning, relancer la musique
      this.playWarningSound();
    }
  },
  
  /**
   * Active le mode warning et joue la musique si nécessaire
   */
  activateWarningMode: function() {
    if (APP_CONFIG.debug) console.log("Activation du mode warning dans SoundControl");
    
    // Marquer le mode warning comme actif
    this.warningActive = true;
    
    // Afficher le bouton de contrôle du son s'il existe
    this.showSoundButton();
    
    // Jouer la musique d'avertissement si le son n'est pas désactivé
    if (!this.muted) {
      this.playWarningSound();
    }
  },
  
  /**
   * Désactive le mode warning et arrête la musique
   */
  deactivateWarningMode: function() {
    if (APP_CONFIG.debug) console.log("Désactivation du mode warning dans SoundControl");
    
    // Marquer le mode warning comme inactif
    this.warningActive = false;
    
    // Masquer le bouton de contrôle du son
    this.hideSoundButton();
    
    // Arrêter la musique d'avertissement
    this.stopWarningSound();
  },
  
  /**
   * Joue la musique d'avertissement
   */
  playWarningSound: function() {
    // Ne pas jouer si le son est désactivé ou si on n'est pas en mode warning
    if (this.muted || !this.warningActive) return;
    
    if (APP_CONFIG.debug) console.log("Tentative de lecture du son d'avertissement");
    
    // Vérifier que l'élément audio existe
    if (!this.warningSound) return;
    
    // Configurer le son
    this.warningSound.loop = true;
    this.warningSound.volume = 0.3;
    
    // Tenter de lire le son
    const playPromise = this.warningSound.play();
    
    // Gérer les erreurs
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Tenter une autre approche après un court délai
        setTimeout(() => {
          // Vérifier à nouveau l'état avant de réessayer
          if (!this.muted && this.warningActive) {
            this.tryUnblockAudio();
          }
        }, 500);
      });
    }
  },
  
  /**
   * Arrête la musique d'avertissement
   */
  stopWarningSound: function() {
    // Vérifier que l'élément audio existe
    if (!this.warningSound) return;
    
    // Arrêter la lecture
    this.warningSound.pause();
    this.warningSound.currentTime = 0;
  },
  
  /**
   * Affiche le bouton de contrôle du son
   */
  showSoundButton: function() {
    // Ne montrer le bouton que si on est sur l'écran de checklist
    if (!this.soundButton || !this.isChecklist()) return;
    
    // Utiliser setProperty pour s'assurer que le style est appliqué avec !important
    this.soundButton.style.setProperty('display', 'flex', 'important');
    
    // Mettre à jour l'apparence
    this.updateButtonAppearance();
  },
  
  /**
   * Masque le bouton de contrôle du son
   */
  hideSoundButton: function() {
    if (!this.soundButton) return;
    
    this.soundButton.style.setProperty('display', 'none', 'important');
  },
  
  /**
   * Vérifie si on est sur l'écran de checklist
   * @returns {boolean} - true si on est sur l'écran de checklist
   */
  isChecklist: function() {
    // Vérifier si l'écran de checklist est visible
    const checklistScreen = document.getElementById('checklist-screen');
    return checklistScreen && checklistScreen.style.display !== 'none';
  },
  
  /**
   * Tente de débloquer l'audio pour Chrome
   */
  tryUnblockAudio: function() {
    // Créer un contexte audio temporaire
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Simuler une interaction utilisateur
      this.simulateUserInteraction();
      
      // Réessayer de jouer le son après le déblocage
      setTimeout(() => {
        if (!this.muted && this.warningActive) {
          this.playWarningSound();
        }
      }, 100);
    } catch(e) {
      if (APP_CONFIG.debug) console.error("Erreur lors du déblocage audio:", e);
    }
  },
  
  /**
   * Simule une interaction utilisateur pour débloquer l'audio
   */
  simulateUserInteraction: function() {
    // Créer un élément de bouton invisible
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '-100px';
    button.style.width = '1px';
    button.style.height = '1px';
    button.style.opacity = '0';
    document.body.appendChild(button);
    
    // Simuler un clic
    button.click();
    
    // Simuler divers événements
    ['click', 'touchstart', 'touchend', 'mousedown'].forEach(eventType => {
      try {
        const event = new Event(eventType, { bubbles: true });
        button.dispatchEvent(event);
        document.dispatchEvent(event);
      } catch(e) {
        // Ignorer les erreurs
      }
    });
    
    // Supprimer l'élément
    setTimeout(() => {
      document.body.removeChild(button);
    }, 100);
  }
};

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
  SoundControl.init();
});

// Initialiser aussi dès que possible
if (document.readyState !== 'loading') {
  SoundControl.init();
}

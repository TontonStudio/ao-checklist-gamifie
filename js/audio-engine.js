/**
 * Gestionnaire audio simplifié pour la lecture automatique
 * Utilise une technique qui a fait ses preuves dans la version précédente
 */
const AudioEngine = {
  // Éléments audio
  elements: {
    success: document.getElementById('success-sound'),
    check: document.getElementById('check-sound'),
    uncheck: document.getElementById('uncheck-sound'),
    finish: document.getElementById('finish-sound'),
    warning: document.getElementById('warning-sound')
  },
  
  // État du son
  muted: false,
  
  // Clé pour le localStorage
  STORAGE_KEY: 'tontonAoMusicMuted',
  
  /**
   * Initialise le moteur audio
   */
  init: function() {
    console.log("Initialisation du moteur audio");
    // Charger l'état sauvegardé du son
    this.loadMuteState();
    
    // Débloquer l'audio en préchargeant tous les sons avec volume à 0
    this.preloadSounds();
    
    // Configurer le bouton de son
    this.setupSoundButton();
  },
  
  /**
   * Charge l'état de désactivation du son depuis le localStorage
   */
  loadMuteState: function() {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState !== null) {
      this.muted = savedState === 'true';
    }
  },
  
  /**
   * Sauvegarde l'état de désactivation du son dans le localStorage
   */
  saveMuteState: function() {
    localStorage.setItem(this.STORAGE_KEY, this.muted);
    console.log("État du son sauvegardé:", this.muted);
  },
  
  /**
   * Configure le bouton de contrôle du son
   */
  setupSoundButton: function() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;
    
    // Masquer le bouton par défaut
    soundToggle.style.display = 'none';
    
    // Mettre à jour l'apparence du bouton
    this.updateSoundButtonAppearance(soundToggle);
    
    // Ajouter le gestionnaire d'événement pour le clic
    soundToggle.addEventListener('click', () => {
      this.toggleMute();
      this.updateSoundButtonAppearance(soundToggle);
    });
  },
  
  /**
   * Met à jour l'apparence du bouton de son
   * @param {HTMLElement} button - Élément bouton
   */
  updateSoundButtonAppearance: function(button) {
    if (!button) return;
    
    // Mettre à jour l'émoji et le titre
    button.textContent = this.muted ? '🔇' : '🔊';
    button.title = this.muted ? 'Activer le son' : 'Couper le son';
    
    // Ajouter/retirer l'attribut data-muted pour le style CSS
    button.setAttribute('data-muted', this.muted);
  },
  
  /**
   * Précharge tous les sons pour débloquer l'audio
   */
  preloadSounds: function() {
    Object.values(this.elements).forEach(element => {
      if (!element) return;
      
      // Tenter de lire chaque son brièvement avec volume à 0
      const originalVolume = element.volume;
      element.volume = 0;
      
      const playPromise = element.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            element.pause();
            element.currentTime = 0;
            element.volume = originalVolume;
          })
          .catch(e => {
            // Ignorer les erreurs - on s'y attend
            element.volume = originalVolume;
          });
      }
    });
    
    // Créer également une "fake user interaction" pour certains navigateurs
    this.simulateUserInteraction();
  },
  
  /**
   * Simule une interaction utilisateur pour débloquer l'audio
   * Fonctionne dans certains cas mais pas tous
   */
  simulateUserInteraction: function() {
    // Créer un élément invisible
    const interactionElement = document.createElement('button');
    interactionElement.style.position = 'fixed';
    interactionElement.style.top = '-100px';
    interactionElement.style.width = '1px';
    interactionElement.style.height = '1px';
    interactionElement.style.opacity = '0';
    
    // Ajouter l'élément au DOM
    document.body.appendChild(interactionElement);
    
    // Simuler un clic sur l'élément
    interactionElement.click();
    
    // Simuler un événement d'interaction
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    interactionElement.dispatchEvent(event);
    
    // Supprimer l'élément
    setTimeout(() => {
      document.body.removeChild(interactionElement);
    }, 100);
    
    // Autre approche avec les événements tactiles
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(touchEvent);
  },
  
  /**
   * Joue un son par son identifiant
   * @param {string} id - Identifiant du son
   * @param {Object} options - Options de lecture
   */
  playSound: function(id, options = {}) {
    // Ne pas jouer si le son est désactivé
    if (this.muted) return;
    
    const element = this.elements[id];
    if (!element) {
      console.warn(`Son '${id}' non disponible`);
      return;
    }
    
    // Configurer le son
    element.loop = options.loop || false;
    element.volume = options.volume || 1;
    
    // Réinitialiser la position si le son est déjà en cours de lecture
    if (!element.paused) {
      element.currentTime = 0;
    }
    
    // Tenter de lire le son
    const playPromise = element.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn(`Erreur lors de la lecture du son '${id}':`, e);
        
        // Si le son est important, essayer une autre approche
        if (options.important) {
          this.playWithWorkaround(element);
        }
      });
    }
  },
  
  /**
   * Tente de lire un son en utilisant une approche alternative
   * @param {HTMLAudioElement} element - Élément audio
   */
  playWithWorkaround: function(element) {
    // Approche 1: Déclencher une interaction utilisateur simulée
    this.simulateUserInteraction();
    
    // Nouvelle tentative de lecture après un court délai
    setTimeout(() => {
      element.play().catch(() => {
        // Ignorons l'erreur à ce stade
      });
    }, 100);
  },
  
  /**
   * Arrête un son par son identifiant
   * @param {string} id - Identifiant du son
   */
  stopSound: function(id) {
    const element = this.elements[id];
    if (!element) return;
    
    element.pause();
    element.currentTime = 0;
  },
  
  /**
   * Joue le son d'avertissement (méthode spécifique)
   */
  playWarningSound: function() {
    if (this.muted) return;
    
    const warning = this.elements.warning;
    if (!warning) return;
    
    warning.loop = true;
    warning.volume = 0.3;
    
    // Plusieurs tentatives de lecture
    const playPromise = warning.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn("Erreur lors de la lecture du son d'avertissement:", e);
        
        // Tentative alternative 1
        setTimeout(() => {
          this.simulateUserInteraction();
          warning.play().catch(() => {
            // Tentative alternative 2
            setTimeout(() => {
              warning.play().catch(() => {
                // Abandonner après plusieurs tentatives
              });
            }, 500);
          });
        }, 100);
      });
    }
  },
  
  /**
   * Inverse l'état de désactivation du son
   */
  toggleMute: function() {
    this.muted = !this.muted;
    this.saveMuteState();
    
    // Arrêter tous les sons immédiatement si on désactive le son
    if (this.muted) {
      Object.values(this.elements).forEach(element => {
        if (element && !element.paused) {
          element.pause();
          element.currentTime = 0;
        }
      });
      console.log("Sons arrêtés et mode muet activé");
    } 
    // Jouer le son uniquement si on réactive le son et qu'on est en mode warning
    else if (CountdownManager && CountdownManager.warningActive) {
      console.log("Mode muet désactivé, reprise de la lecture");
      this.playWarningSound();
    }
    
    console.log("Son " + (this.muted ? "désactivé" : "activé"));
    return this.muted;
  },
  
  /**
   * Affiche le bouton de contrôle du son (en mode warning)
   */
  showSoundButton: function() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;
    
    // Forcer l'affichage avec !important
    soundToggle.style.setProperty('display', 'flex', 'important');
    
    // Mettre à jour l'apparence du bouton
    this.updateSoundButtonAppearance(soundToggle);
  },
  
  /**
   * Masque le bouton de contrôle du son
   */
  hideSoundButton: function() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;
    
    soundToggle.style.display = 'none';
    
    // Arrêter le son d'avertissement
    this.stopSound('warning');
  }
};

// Initialiser le moteur audio dès que possible
document.addEventListener('DOMContentLoaded', function() {
  AudioEngine.init();
});

// Tenter également d'initialiser avant le chargement complet pour certains navigateurs
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AudioEngine.init.bind(AudioEngine));
} else {
  AudioEngine.init();
}

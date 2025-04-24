/**
 * Contrôleur de son centralisé optimisé
 * Gère la lecture et la mise en sourdine des sons d'avertissement
 */
const SoundControl = {
  // État du son (désactivé ou non)
  muted: false,
  
  // Référence aux éléments audio (chargés une seule fois)
  warningSound: null,
  soundButton: null,
  
  // Cache pour l'écran de checklist
  checklistScreen: null,
  
  // Clé pour le localStorage
  STORAGE_KEY: 'tontonAoMusicMuted',
  
  // État actif de la musique d'avertissement
  warningActive: false,
  
  // Variables pour le fade out
  fadeInterval: null,
  
  /**
   * Initialise le contrôleur de son
   */
  init: function() {
    // Mettre en cache les éléments DOM une seule fois
    this.warningSound = document.getElementById('warning-sound');
    this.soundButton = document.getElementById('sound-toggle');
    this.checklistScreen = document.getElementById('checklist-screen');
    
    // Précharger le son d'avertissement pour éviter les délais
    if (this.warningSound) {
      this.warningSound.preload = 'auto';
      this.warningSound.load();
    }
    
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
    
    // Créer un attribut personnalisé sur document.body pour indiquer l'état du son (utile pour CSS)
    document.body.setAttribute('data-sound-muted', this.muted.toString());
  },
  
  /**
   * Charge l'état du son depuis localStorage
   */
  loadMuteState: function() {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState !== null) {
        this.muted = savedState === 'true';
      }
    } catch (e) {
      // En cas d'erreur localStorage (ex: navigation privée), continuer avec l'état par défaut
      this.muted = false;
    }
  },
  
  /**
   * Sauvegarde l'état du son dans localStorage
   */
  saveMuteState: function() {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.muted);
    } catch (e) {
      // Ignorer les erreurs de localStorage
    }
  },
  
  /**
   * Met à jour l'apparence du bouton de son
   */
  updateButtonAppearance: function() {
    if (!this.soundButton) return;
    
    // Utiliser requestAnimationFrame pour les changements DOM
    requestAnimationFrame(() => {
      // Mettre à jour l'icône et le titre en une seule opération
      this.soundButton.textContent = this.muted ? '🔇' : '🔊';
      this.soundButton.title = this.muted ? 'Activer le son' : 'Couper le son';
      
      // Utiliser un attribut data pour le style CSS
      this.soundButton.setAttribute('data-muted', this.muted);
      document.body.setAttribute('data-sound-muted', this.muted.toString());
    });
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
    // Éviter les activations redondantes
    if (this.warningActive) return;
    
    // Marquer le mode warning comme actif
    this.warningActive = true;
    
    // Afficher le bouton de contrôle du son
    this.showSoundButton();
    
    // Jouer la musique d'avertissement si le son n'est pas désactivé
    if (!this.muted) {
      // Utiliser un court délai pour éviter les conflits d'opérations audio
      setTimeout(() => this.playWarningSound(), 50);
    }
  },
  
  /**
   * Désactive le mode warning et arrête la musique
   */
  deactivateWarningMode: function() {
    // Éviter les désactivations redondantes
    if (!this.warningActive) return;
    
    // Marquer le mode warning comme inactif
    this.warningActive = false;
    
    // Masquer le bouton de contrôle du son
    this.hideSoundButton();
    
    // Arrêter la musique d'avertissement
    this.stopWarningSound();
  },
  
  /**
   * Joue la musique d'avertissement avec optimisations
   */
  playWarningSound: function() {
    // Ne pas jouer si le son est désactivé, si on n'est pas en mode warning, ou si l'élément n'existe pas
    if (this.muted || !this.warningActive || !this.warningSound) return;
    
    // Si le son est déjà en cours de lecture et n'est pas en pause, ne rien faire
    if (this.warningSound.currentTime > 0 && !this.warningSound.paused) return;
    
    // Nettoyer tout fade out en cours
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    
    // Réinitialiser le volume au cas où il aurait été modifié
    this.warningSound.volume = 0.3;
    
    // Configurer le son
    this.warningSound.loop = true;
    
    // Tenter de lire le son avec gestion optimisée des erreurs
    try {
      const playPromise = this.warningSound.play();
      
      // Gérer uniquement les promesses définies (certains navigateurs ne renvoient pas de promesse)
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si la lecture automatique est bloquée, tenter une autre approche après un court délai
          if (!this.muted && this.warningActive) {
            // Reporter la tentative pour éviter de spammer les erreurs
            setTimeout(() => this.tryUnblockAudio(), 500);
          }
        });
      }
    } catch (e) {
      // Gérer les erreurs de lecture audio (très rares)
      if (APP_CONFIG.debug) {
        console.warn('Erreur de lecture audio :', e);
      }
    }
  },
  
  /**
   * Arrête la musique d'avertissement avec optimisations
   * @param {boolean} fadeOut - Si vrai, effectue un fade out de la musique
   */
  stopWarningSound: function(fadeOut = false) {
    // Vérifications rapides pour éviter les opérations inutiles
    if (!this.warningSound || this.warningSound.paused) return;
    
    // Nettoyer tout fade out en cours
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    
    if (fadeOut) {
      // Effectuer un fade out progressif optimisé
      const initialVolume = this.warningSound.volume;
      
      // Utiliser moins d'étapes pour plus d'efficacité
      const fadeSteps = 10; // Réduit de 20 à 10
      const volumeStep = initialVolume / fadeSteps;
      const stepDuration = 100; // 100ms par étape (total 1s)
      
      let currentStep = 0;
      
      this.fadeInterval = setInterval(() => {
        currentStep++;
        
        // Appliquer le nouveau volume avec vérification de sécurité
        const newVolume = Math.max(0, initialVolume - (volumeStep * currentStep));
        
        try {
          this.warningSound.volume = newVolume;
        } catch (e) {
          // Ignorer les erreurs potentielles de modification de volume
        }
        
        // Quand le fade est complet
        if (currentStep >= fadeSteps) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          
          // Arrêter et réinitialiser le son
          try {
            this.warningSound.pause();
            this.warningSound.currentTime = 0;
            this.warningSound.volume = initialVolume; // Restaurer le volume
          } catch (e) {
            // Ignorer les erreurs potentielles
          }
        }
      }, stepDuration);
    } else {
      // Arrêt immédiat plus sûr
      try {
        this.warningSound.pause();
        this.warningSound.currentTime = 0;
      } catch (e) {
        // Ignorer les erreurs potentielles
      }
    }
  },
  
  /**
   * Affiche le bouton de contrôle du son avec optimisations
   */
  showSoundButton: function() {
    // Vérification rapide pour éviter les opérations DOM inutiles
    if (!this.soundButton || !this.isChecklist()) return;
    
    // Afficher le bouton en une seule opération
    requestAnimationFrame(() => {
      this.soundButton.style.display = 'flex';
      this.updateButtonAppearance();
    });
  },
  
  /**
   * Masque le bouton de contrôle du son
   */
  hideSoundButton: function() {
    if (!this.soundButton) return;
    
    requestAnimationFrame(() => {
      this.soundButton.style.display = 'none';
    });
  },
  
  /**
   * Vérifie si on est sur l'écran de checklist (optimisé)
   * @returns {boolean} - true si on est sur l'écran de checklist
   */
  isChecklist: function() {
    return this.checklistScreen && this.checklistScreen.style.display !== 'none';
  },
  
  /**
   * Tente de débloquer l'audio pour les navigateurs restrictifs
   */
  tryUnblockAudio: function() {
    // Éviter les tentatives multiples
    if (!this.warningActive || this.muted) return;
    
    try {
      // Méthode plus légère pour tenter de débloquer l'audio
      const temp = new Audio();
      temp.autoplay = true;
      temp.volume = 0;
      temp.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      
      // Lecture silencieuse
      const promise = temp.play();
      if (promise !== undefined) {
        promise.then(() => {
          // Si la lecture silencieuse réussit, tenter de jouer le son d'avertissement
          setTimeout(() => {
            if (this.warningActive && !this.muted) {
              this.playWarningSound();
            }
          }, 100);
        }).catch(() => {
          // Si la lecture silencieuse échoue, ne rien faire de plus
        }).finally(() => {
          // Nettoyer
          temp.onended = null;
          temp.onerror = null;
          temp.oncanplaythrough = null;
        });
      }
    } catch(e) {
      // Ignorer les erreurs
    }
  }
};

// Initialisation optimisée pour éviter les blocages de rendu
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialiser après un court délai pour ne pas bloquer le rendu initial
    setTimeout(() => SoundControl.init(), 100);
  });
} else {
  // Si le DOM est déjà chargé, initialiser pendant une période d'inactivité
  requestIdleCallback ? requestIdleCallback(() => SoundControl.init()) : setTimeout(() => SoundControl.init(), 100);
}
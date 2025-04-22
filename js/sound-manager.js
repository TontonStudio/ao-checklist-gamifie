/**
 * Gestion du son de l'application - Uniquement pour la musique d'avertissement
 */
const SoundManager = {
  // État de la musique
  musicMuted: false,
  
  // Élément audio de la musique d'avertissement
  warningSound: document.getElementById('warning-sound'),
  
  // Élément du bouton de contrôle
  soundToggle: document.getElementById('sound-toggle'),
  
  /**
   * Initialisation du gestionnaire de son
   */
  init: function() {
    // Charger l'état depuis localStorage
    this.loadMuteState();
    
    // Masquer le bouton de son par défaut (apparaîtra uniquement en mode warning)
    if (this.soundToggle) {
      this.soundToggle.style.display = 'none';
      this.soundToggle.addEventListener('click', this.toggleMute.bind(this));
    }
    
    // Appliquer l'état initial
    this.updateMuteState();
    
    // S'assurer que le bouton est bien caché au démarrage
    this.hideMusicControl();
    
    // Arrêter immédiatement le son d'avertissement s'il était en cours
    if (this.warningSound) {
      this.warningSound.pause();
      this.warningSound.currentTime = 0;
    }
  },
  
  /**
   * Charge l'état de la musique depuis localStorage
   */
  loadMuteState: function() {
    const savedState = localStorage.getItem('tontonAoMusicMuted');
    if (savedState !== null) {
      this.musicMuted = savedState === 'true';
    }
  },
  
  /**
   * Sauvegarde l'état de la musique dans localStorage
   */
  saveMuteState: function() {
    localStorage.setItem('tontonAoMusicMuted', this.musicMuted);
  },
  
  /**
   * Met à jour l'interface selon l'état du son
   */
  updateMuteState: function() {
    // Mettre à jour l'icône
    if (this.soundToggle) {
      // Même icône pour les deux états (🔊 pour son actif, l'icône barrée sera ajoutée par CSS)
      this.soundToggle.textContent = '🎵';
      this.soundToggle.title = this.musicMuted ? 'Activer la musique' : 'Couper la musique';
      
      // Application de la classe muted pour l'affichage de la barre diagonale
      if (this.musicMuted) {
        this.soundToggle.classList.add('muted');
      } else {
        this.soundToggle.classList.remove('muted');
      }
    }
    
    // Si la musique est coupée, arrêter la musique d'avertissement
    if (this.musicMuted && this.warningSound && !this.warningSound.paused) {
      this.warningSound.pause();
      this.warningSound.currentTime = 0;
    }
  },
  
  /**
   * Inverse l'état de la musique (mute/unmute)
   */
  toggleMute: function() {
    this.musicMuted = !this.musicMuted;
    this.updateMuteState();
    this.saveMuteState();
    
    // Si la musique est réactivée et que le mode warning est actif, relancer la musique
    if (!this.musicMuted && 
        CountdownManager && 
        CountdownManager.warningActive && 
        this.warningSound) {
      this.warningSound.loop = true;
      this.warningSound.volume = 0.3;
      this.warningSound.play().catch(e => {
        console.log('Erreur lors de la lecture du son d\'avertissement:', e);
      });
    }
  },
  
  /**
   * Affiche le bouton de contrôle du son (à appeler en mode warning)
   */
  showMusicControl: function() {
    // Ne montrer le bouton que si nous sommes en mode warning
    if (this.soundToggle && CountdownManager && CountdownManager.warningActive) {
      // Styles fixes pour assurer une apparence cohérente
      const fixedStyle = `
        position: fixed !important;
        bottom: 20px !important; 
        right: 20px !important;
        width: 40px !important;
        height: 40px !important;
        background-color: #90EE90 !important;
        color: var(--gb-darkest);
        border: 2px solid var(--gb-darkest);
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 20px !important;
        cursor: pointer;
        z-index: 2000 !important;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      `;
      
      this.soundToggle.style.cssText = fixedStyle;
    }
  },
  
  /**
   * Masque le bouton de contrôle du son (à appeler quand le mode warning est désactivé)
   */
  hideMusicControl: function() {
    if (this.soundToggle) {
      this.soundToggle.style.display = 'none';
      
      // Arrêter également la musique d'avertissement
      if (this.warningSound && !this.warningSound.paused) {
        this.fadeOutMusic();
      }
    }
  },
  
  /**
   * Effectue un fade out sur la musique d'avertissement
   * @param {number} duration - Durée du fade en ms
   */
  fadeOutMusic: function(duration = 1000) {
    if (!this.warningSound || this.musicMuted || this.warningSound.paused) return;
    
    const initialVolume = this.warningSound.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = initialVolume / steps;
    
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
      currentStep++;
      
      if (currentStep >= steps) {
        this.warningSound.pause();
        this.warningSound.currentTime = 0;
        this.warningSound.volume = initialVolume; // Rétablir le volume
        clearInterval(fadeInterval);
        return;
      }
      
      this.warningSound.volume = initialVolume - (volumeStep * currentStep);
    }, stepDuration);
  }
};

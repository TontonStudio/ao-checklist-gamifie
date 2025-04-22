/**
 * Correction pour le bouton de contrôle du son
 * - Affichage uniquement en mode warning
 * - Position fixe à l'écran
 * - Sauvegarde de l'état dans localStorage
 */
document.addEventListener('DOMContentLoaded', function() {
  const soundToggle = document.getElementById('sound-toggle');
  const warningSound = document.getElementById('warning-sound');
  
  // Clé pour le localStorage
  const SOUND_STATE_KEY = 'tontonAoMusicMuted';
  
  // Fonction pour charger l'état du son depuis localStorage
  function loadSoundState() {
    const savedState = localStorage.getItem(SOUND_STATE_KEY);
    return savedState === 'true'; // true si le son est coupé, false sinon
  }
  
  // Fonction pour sauvegarder l'état du son dans localStorage
  function saveSoundState(isMuted) {
    localStorage.setItem(SOUND_STATE_KEY, isMuted);
  }
  
  // Récupérer l'état sauvegardé (ou faux par défaut)
  let isMuted = loadSoundState();
  
  // S'assurer que le bouton est initialement masqué
  if (soundToggle) {
    // Appliquer les styles fixes pour garantir la position et l'apparence
    soundToggle.style.display = 'none';
    
    // Mise à jour initiale de l'apparence du bouton
    updateButtonAppearance();
    
    // Gestion du clic sur le bouton
    soundToggle.addEventListener('click', function() {
      isMuted = !isMuted;
      
      // Sauvegarder le nouvel état
      saveSoundState(isMuted);
      
      // Mettre à jour l'apparence du bouton
      updateButtonAppearance();
      
      // Appliquer l'effet audio
      applyAudioState();
    });
  }
  
  // Fonction pour mettre à jour l'apparence du bouton
  function updateButtonAppearance() {
    if (!soundToggle) return;
    
    // Changer l'icône selon l'état
    soundToggle.textContent = isMuted ? '🔇' : '🔊';
    
    // Utiliser un attribut data pour le style CSS
    soundToggle.setAttribute('data-muted', isMuted);
    
    // Changer le titre aussi pour l'accessibilité
    soundToggle.title = isMuted ? 'Activer le son' : 'Couper le son';
  }
  
  // Fonction pour appliquer l'état audio
  function applyAudioState() {
    if (!warningSound) return;
    
    if (isMuted) {
      // Couper le son s'il est activé
      warningSound.pause();
      warningSound.currentTime = 0;
    } else {
      // Activer le son si on est en mode warning
      if (CountdownManager && CountdownManager.warningActive) {
        warningSound.loop = true;
        warningSound.volume = 0.3;
        warningSound.play().catch(e => console.log('Erreur lecture son:', e));
      }
    }
  }
  
  // Patch de la méthode activateWarningMode pour afficher le bouton
  if (window.CountdownManager && CountdownManager.activateWarningMode) {
    const originalActivate = CountdownManager.activateWarningMode;
    
    CountdownManager.activateWarningMode = function(container, message) {
      // Appeler la fonction originale d'abord
      originalActivate.call(this, container, message);
      
      // Afficher le bouton de son quand le mode warning est activé
      if (soundToggle) {
        // Forcer l'affichage avec !important via le style inline
        soundToggle.style.display = 'flex !important';
        
        // Astuce pour appliquer le !important en JavaScript
        setTimeout(() => {
          soundToggle.style.setProperty('display', 'flex', 'important');
        }, 0);
        
        // Appliquer l'état audio actuel
        applyAudioState();
      }
    };
  }
  
  // Patch de la méthode deactivateWarningMode pour masquer le bouton
  if (window.CountdownManager && CountdownManager.deactivateWarningMode) {
    const originalDeactivate = CountdownManager.deactivateWarningMode;
    
    CountdownManager.deactivateWarningMode = function(container, message) {
      // Appeler la fonction originale d'abord
      originalDeactivate.call(this, container, message);
      
      // Masquer le bouton de son quand le mode warning est désactivé
      if (soundToggle) {
        soundToggle.style.setProperty('display', 'none', 'important');
      }
      
      // S'assurer que le son est arrêté
      if (warningSound) {
        warningSound.pause();
        warningSound.currentTime = 0;
      }
    };
  }
  
  // Désactiver le SoundManager si déjà chargé pour éviter les conflits
  if (window.SoundManager) {
    // Stocker la référence aux fonctions originales
    const originalShowMusicControl = SoundManager.showMusicControl;
    const originalHideMusicControl = SoundManager.hideMusicControl;
    
    // Remplacer par des fonctions vides pour éviter les conflits
    SoundManager.showMusicControl = function() {
      // On ne fait rien, notre fix-sound-button.js gère l'affichage
      console.log("SoundManager.showMusicControl désactivé par fix-sound-button.js");
    };
    
    SoundManager.hideMusicControl = function() {
      // On ne fait rien, notre fix-sound-button.js gère l'affichage
      console.log("SoundManager.hideMusicControl désactivé par fix-sound-button.js");
    };
  }
  
  // Vérifier immédiatement si le mode warning est actif pour afficher le bouton si nécessaire
  if (CountdownManager && CountdownManager.warningActive && soundToggle) {
    soundToggle.style.setProperty('display', 'flex', 'important');
    applyAudioState();
  }
});
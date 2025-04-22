/**
 * Script pour forcer le déblocage audio sur différents navigateurs
 */
(function() {
  // S'exécuter immédiatement pour essayer de débloquer l'audio le plus tôt possible
  let audioUnlocked = false;
  const audioElements = document.querySelectorAll('audio');
  
  /**
   * Tente de débloquer l'audio avec diverses techniques
   */
  function unlockAudio() {
    if (audioUnlocked) return;
    
    // 1. Créer un contexte audio temporaire
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Créer un oscillateur silencieux et le démarrer/arrêter immédiatement
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Volume à 0
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(0);
      oscillator.stop(0.001);
    } catch(e) {
      // Contexte Audio non supporté - silencieux
    }
    
    // 2. Tentative de lecture/pause sur chaque élément audio
    audioElements.forEach(audio => {
      // Conserver le volume original et mettre à 0 temporairement
      const originalVolume = audio.volume;
      audio.volume = 0;
      
      // Tenter de lire puis pauser immédiatement
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = originalVolume;
        }).catch(e => {
          audio.volume = originalVolume;
        });
      }
    });
    
    // 3. Simuler une interaction utilisateur avec des événements
    simulateUserInteraction();
    
    // 4. Marquer comme réussi malgré les potentielles erreurs
    audioUnlocked = true;
  }
  
  /**
   * Simule une interaction utilisateur pour débloquer l'audio
   */
  function simulateUserInteraction() {
    // Créer un élément de bouton invisible
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '-100px';
    button.style.width = '1px';
    button.style.height = '1px';
    button.style.opacity = '0';
    document.body.appendChild(button);
    
    // Essayer plusieurs événements différents
    const events = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'];
    events.forEach(eventType => {
      try {
        const event = eventType.startsWith('touch') 
          ? new TouchEvent(eventType, { bubbles: true }) 
          : new MouseEvent(eventType, { bubbles: true });
        button.dispatchEvent(event);
        document.dispatchEvent(event); // Également envoyer au document
      } catch(e) {
        // Ignorer les erreurs, certains navigateurs ne supportent pas tous les événements
      }
    });
    
    // Supprimer l'élément après utilisation
    setTimeout(() => {
      document.body.removeChild(button);
    }, 100);
  }
  
  /**
   * Vérifie et joue le son d'avertissement si nécessaire
   */
  function checkAndPlayWarningSound() {
    if (window.CountdownManager && CountdownManager.warningActive) {
      if (typeof SoundControl !== 'undefined') {
        // Vérifier si le son n'est pas en mode muet avant de le jouer
        if (!SoundControl.muted) {
          SoundControl.playWarningSound();
        }
      } else if (typeof CountdownManager !== 'undefined' && 
                 CountdownManager.warningActive) {
        // Fallback - essayer de jouer directement le son
        const warningSound = document.getElementById('warning-sound');
        if (warningSound) {
          warningSound.play().catch(() => {});
        }
      }
    }
  }
  
  // Tenter de débloquer l'audio à différents moments
  
  // 1. Immédiatement (pour certains navigateurs)
  unlockAudio();
  
  // 2. Au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      unlockAudio();
      setTimeout(checkAndPlayWarningSound, 500);
    });
  } else {
    setTimeout(checkAndPlayWarningSound, 500);
  }
  
  // 3. À la fin du chargement de la page
  window.addEventListener('load', () => {
    unlockAudio();
    setTimeout(checkAndPlayWarningSound, 500);
  });
  
  // 4. Après un délai (pour être sûr que tout est chargé)
  setTimeout(unlockAudio, 1000);
  setTimeout(checkAndPlayWarningSound, 1500);
  
  // 5. À la première interaction utilisateur réelle
  const userEvents = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'];
  userEvents.forEach(event => {
    document.addEventListener(event, function onceUnlock() {
      unlockAudio();
      checkAndPlayWarningSound();
      // Supprimer les écouteurs après la première interaction
      userEvents.forEach(e => document.removeEventListener(e, onceUnlock));
    }, { once: true });
  });
  
  // 6. Tentatives multiples espacées dans le temps pour les cas difficiles
  [2000, 3000, 5000].forEach(delay => {
    setTimeout(() => {
      unlockAudio();
      checkAndPlayWarningSound();
    }, delay);
  });
})();

/**
 * Gestionnaire amélioré pour la barre de progression fixe
 * 
 * Ce script remplace l'ancien système de gestion de la barre fixe
 * avec une implémentation plus robuste et plus réactive
 */

// Exécution immédiate pour ne pas attendre le DOMContentLoaded
(function() {
  // Éléments DOM pour la barre de progression
  const progressWrapper = document.getElementById('progress-wrapper');
  const progressSpacer = document.getElementById('progress-spacer');
  
  // Variables pour la détection de position
  let progressWrapperPos = 0;
  let lastKnownScrollPosition = 0;
  let ticking = false;
  let isFixed = false;
  let cachedWidth = 0;
  let resizeDebounceTimer = null;
  let scrollThrottleTimer = null;
  
  // Calcul optimisé de la position de la barre
  function calculatePosition() {
    if (!progressWrapper) return;
    
    const rect = progressWrapper.getBoundingClientRect();
    progressWrapperPos = rect.top + window.scrollY;
    
    // Pré-calculer la largeur
    updateProgressBarWidth();
  }
  
  // Mettre à jour la largeur de la barre de progression (seulement quand nécessaire)
  function updateProgressBarWidth() {
    if (!progressWrapper) return;
    
    const activeContainer = document.querySelector('.gameboy-container:not([style*="display: none"])');
    if (activeContainer) {
      const containerWidth = activeContainer.offsetWidth;
      const paddingAdjustment = 40; // Ajustement pour le padding
      cachedWidth = (containerWidth - paddingAdjustment) + 'px';
    }
  }
  
  // Mise à jour de la position fixe (appelée lors du défilement) avec throttling amélioré
  function updateFixedState() {
    if (!progressWrapper || !progressSpacer) return;
    
    // Déterminer si la barre doit être fixée
    const shouldBeFixed = window.scrollY >= progressWrapperPos;
    
    // N'agir que si l'état doit changer
    if (shouldBeFixed !== isFixed) {
      isFixed = shouldBeFixed;
      
      // Utiliser requestAnimationFrame pour éviter les reflows forcés
      requestAnimationFrame(() => {
        if (shouldBeFixed) {
          // Définir la hauteur du spacer une seule fois
          if (!progressSpacer.style.height) {
            progressSpacer.style.height = progressWrapper.offsetHeight + 'px';
          }
          
          // Utiliser la largeur pré-calculée
          progressWrapper.style.width = cachedWidth;
          
          // Ajouter les classes sans modifier les styles individuellement
          progressWrapper.classList.add('fixed');
          progressSpacer.classList.add('active');
          
          // Ajouter un attribut data pour les styles CSS au lieu de modifier chaque tag
          document.body.setAttribute('data-fixed-progress', 'true');
        } else {
          // Supprimer les classes
          progressWrapper.classList.remove('fixed');
          progressSpacer.classList.remove('active');
          progressWrapper.style.width = '';
          
          // Supprimer l'attribut data
          document.body.removeAttribute('data-fixed-progress');
        }
      });
    }
  }
  
  // Gestionnaire de défilement optimisé avec throttling amélioré
  function onScroll() {
    // Utiliser un throttling plus efficace
    if (!scrollThrottleTimer) {
      scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;
        updateFixedState();
      }, 10); // 10ms throttle est suffisant pour une expérience fluide
    }
  }
  
  // Gestionnaire de redimensionnement avec debouncing
  function onResize() {
    // Annuler tout timer existant
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer);
    }
    
    // Débouncer les événements de redimensionnement
    resizeDebounceTimer = setTimeout(() => {
      updateProgressBarWidth();
      if (isFixed) {
        progressWrapper.style.width = cachedWidth;
      }
    }, 250); // 250ms debounce pour le redimensionnement
  }
  
  // Initialisation avec requestIdleCallback si disponible, sinon setTimeout
  const initialize = function() {
    // Calculer la position initiale
    calculatePosition();
    
    // Appliquer l'état initial
    updateFixedState();
    
    // Attacher les gestionnaires d'événements optimisés
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    
    // Préparer le navigateur pour les animations
    if (progressWrapper) {
      progressWrapper.style.willChange = 'transform';
    }
  };
  
  // Utiliser requestIdleCallback si disponible pour un meilleur timing d'initialisation
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initialize);
  } else {
    setTimeout(initialize, 200);
  }
  
  // Événement spécial pour recalculer après que tous les éléments sont chargés
  window.addEventListener('load', function() {
    // Recalculer après un court délai pour s'assurer que tous les éléments sont rendus
    setTimeout(calculatePosition, 300);
  });
  
  // Exposer une fonction pour forcer le recalcul (utilisée lors des changements de mode)
  window.recalculateProgressBar = function() {
    calculatePosition();
    updateFixedState();
  };
})();
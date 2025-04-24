/**
 * Gestionnaire amélioré pour la barre de progression fixe
 * 
 * Correction du bug où la barre reste parfois bloquée en position fixe
 */

// Exécution immédiate pour ne pas attendre le DOMContentLoaded
(function() {
  // Éléments DOM pour la barre de progression
  const progressWrapper = document.getElementById('progress-wrapper');
  const progressSpacer = document.getElementById('progress-spacer');
  
  // Variables pour la détection de position
  let progressWrapperPos = 0;
  let isFixed = false;
  let cachedWidth = 0;
  let resizeDebounceTimer = null;
  let scrollThrottleTimer = null;
  let fixationThreshold = 5; // Marge de tolérance en pixels
  
  // Calcul optimisé de la position de la barre
  function calculatePosition() {
    if (!progressWrapper) return;
    
    const rect = progressWrapper.getBoundingClientRect();
    progressWrapperPos = rect.top + window.scrollY;
    
    // Pré-calculer la largeur
    updateProgressBarWidth();
    
    // Forcer une mise à jour immédiate de l'état
    updateFixedState(true);
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
  
  // Mise à jour de la position fixe avec vérification plus robuste
  function updateFixedState(forceUpdate = false) {
    if (!progressWrapper || !progressSpacer) return;
    
    // Déterminer si la barre doit être fixée avec une marge de tolérance
    // Ajout d'une marge de tolérance pour éviter les problèmes aux limites
    const shouldBeFixed = window.scrollY >= (progressWrapperPos - fixationThreshold);
    
    // N'agir que si l'état doit changer ou si nous forçons la mise à jour
    if (shouldBeFixed !== isFixed || forceUpdate) {
      isFixed = shouldBeFixed;
      
      // Utiliser requestAnimationFrame pour éviter les reflows forcés
      requestAnimationFrame(() => {
        if (shouldBeFixed) {
          // Définir la hauteur du spacer une seule fois ou lors d'un forceUpdate
          if (!progressSpacer.style.height || forceUpdate) {
            progressSpacer.style.height = progressWrapper.offsetHeight + 'px';
          }
          
          // Utiliser la largeur pré-calculée
          progressWrapper.style.width = cachedWidth;
          
          // Ajouter les classes sans modifier les styles individuellement
          progressWrapper.classList.add('fixed');
          progressSpacer.classList.add('active');
          
          // Ajouter un attribut data pour les styles CSS
          document.body.setAttribute('data-fixed-progress', 'true');
          
          // Appliquer les styles spécifiques au mode warning si actif
          if (document.body.classList.contains('warning-mode')) {
            progressWrapper.style.backgroundColor = '#ffeeee';
            progressWrapper.style.borderColor = '#cc0000';
            progressSpacer.style.backgroundColor = '#cc0000';
          }
        } else {
          // Supprimer les classes
          progressWrapper.classList.remove('fixed');
          progressSpacer.classList.remove('active');
          progressWrapper.style.width = '';
          progressWrapper.style.backgroundColor = '';
          progressWrapper.style.borderColor = '';
          
          // Supprimer l'attribut data
          document.body.removeAttribute('data-fixed-progress');
        }
      });
    }
  }
  
  // Nouvelle fonction: vérifier si l'élément est réellement visible
  function isElementFullyInViewport() {
    if (!progressWrapper) return false;
    
    const rect = progressWrapper.getBoundingClientRect();
    
    // Vérifier si l'élément est entièrement visible dans la fenêtre
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }
  
  // Gestionnaire de défilement amélioré avec vérification supplémentaire
  function onScroll() {
    // Annuler tout timer existant pour éviter l'accumulation
    if (scrollThrottleTimer) {
      clearTimeout(scrollThrottleTimer);
    }
    
    // Correction immédiate: si nous sommes au début de la page, on s'assure que la barre n'est pas fixe
    if (window.scrollY <= 10 && isFixed) {
      isFixed = false;
      requestAnimationFrame(() => {
        progressWrapper.classList.remove('fixed');
        progressSpacer.classList.remove('active');
        progressWrapper.style.width = '';
        document.body.removeAttribute('data-fixed-progress');
      });
    }
    
    // Throttle normal pour les autres cas
    scrollThrottleTimer = setTimeout(() => {
      scrollThrottleTimer = null;
      
      // Vérification supplémentaire pour les cas limites
      if (isFixed && isElementFullyInViewport() && window.scrollY < progressWrapperPos) {
        isFixed = false;
        requestAnimationFrame(() => {
          progressWrapper.classList.remove('fixed');
          progressSpacer.classList.remove('active');
          progressWrapper.style.width = '';
          document.body.removeAttribute('data-fixed-progress');
        });
      } else {
        updateFixedState();
      }
    }, 10);
  }
  
  // Gestionnaire de redimensionnement avec debouncing et recalcul complet
  function onResize() {
    // Annuler tout timer existant
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer);
    }
    
    // Débouncer les événements de redimensionnement
    resizeDebounceTimer = setTimeout(() => {
      // Recalcul complet après redimensionnement
      calculatePosition();
      
      // Forcer une mise à jour immédiate de l'état si fixé
      if (isFixed) {
        progressWrapper.style.width = cachedWidth;
      }
    }, 250);
  }
  
  // Fonction pour forcer une réinitialisation complète (appeler en cas de problème)
  function forceReset() {
    // Retirer l'état fixe quoi qu'il arrive
    isFixed = false;
    
    // Nettoyer toutes les classes et styles
    requestAnimationFrame(() => {
      progressWrapper.classList.remove('fixed');
      progressSpacer.classList.remove('active');
      progressWrapper.style.width = '';
      document.body.removeAttribute('data-fixed-progress');
      
      // Recalculer complètement la position
      setTimeout(calculatePosition, 50);
    });
  }
  
  // Initialisation avec requestIdleCallback si disponible, sinon setTimeout
  const initialize = function() {
    if (!progressWrapper || !progressSpacer) return;
    
    // Calculer la position initiale
    calculatePosition();
    
    // Attacher les gestionnaires d'événements optimisés
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    
    // Préparer le navigateur pour les animations
    progressWrapper.style.willChange = 'transform';

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
    
    // Vérifier à nouveau après un délai plus long pour être sûr
    setTimeout(calculatePosition, 1000);
  });
  
  // Expose des fonctions pour forcer le recalcul et la réinitialisation
  window.recalculateProgressBar = calculatePosition;
  window.resetProgressBarState = forceReset;
  
  // Mécanisme de sécurité: vérification périodique de l'état de la barre
  setInterval(function() {
    // Si nous sommes tout en haut de la page mais que la barre est fixe, force reset
    if (window.scrollY < 10 && isFixed) {
      forceReset();
    }
    
    // Si la barre est complètement visible mais toujours fixe, force reset
    if (isFixed && isElementFullyInViewport() && window.scrollY < progressWrapperPos) {
      forceReset();
    }
  }, 2000); // Vérifier toutes les 2 secondes
})();
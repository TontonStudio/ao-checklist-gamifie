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
  
  // Récalcule la position de la barre
  function calculatePosition() {
    if (!progressWrapper) return;
    
    const header = document.querySelector('header');
    if (header) {
      progressWrapperPos = progressWrapper.getBoundingClientRect().top + window.scrollY;
    }
  }
  
  // Mise à jour de la position fixe (appelée lors du défilement)
  function updateFixedState(scrollPos) {
    if (!progressWrapper || !progressSpacer) return;
    
    // Déterminer si la barre doit être fixée
    const shouldBeFixed = scrollPos >= progressWrapperPos;
    
    // N'agir que si l'état doit changer
    if (shouldBeFixed !== isFixed) {
      isFixed = shouldBeFixed;
      
      if (shouldBeFixed) {
        // Définir la hauteur du spacer
        progressSpacer.style.height = progressWrapper.offsetHeight + 'px';
        
        // Définir la largeur de la barre fixée
        const activeContainer = document.querySelector('.gameboy-container:not([style*="display: none"])');
        if (activeContainer) {
          const containerWidth = activeContainer.offsetWidth;
          const paddingAdjustment = 40; // Ajustement pour le padding
          progressWrapper.style.width = (containerWidth - paddingAdjustment) + 'px';
        }
        
        // S'assurer que les badges DONE restent visibles en ajustant leurs positions z-index
        document.querySelectorAll('.task-done-tag').forEach(tag => {
          tag.style.zIndex = '1000';
        });
        
        // Activer la position fixe
        progressWrapper.classList.add('fixed');
        progressSpacer.classList.add('active');
      } else {
        // Désactiver la position fixe
        progressWrapper.classList.remove('fixed');
        progressSpacer.classList.remove('active');
        progressWrapper.style.width = '';
      }
    }
  }
  
  // Gestionnaire principal pour le défilement (avec throttling)
  function onScroll() {
    lastKnownScrollPosition = window.scrollY;
    
    if (!ticking) {
      // Utiliser requestAnimationFrame pour limiter les mises à jour
      window.requestAnimationFrame(function() {
        updateFixedState(lastKnownScrollPosition);
        ticking = false;
      });
      
      ticking = true;
    }
  }
  
  // Initialisation après un court délai pour s'assurer que la page est chargée
  setTimeout(function() {
    // Calculer la position initiale
    calculatePosition();
    
    // Appliquer l'état initial
    updateFixedState(window.scrollY);
    
    // Attacher les gestionnaires d'événements
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function() {
      calculatePosition();
      updateFixedState(window.scrollY);
    });
    
    // S'assurer que les ajustements sont appliqués lors des transitions de page
    document.addEventListener('click', function(e) {
      // Recalculer après un court délai si on clique sur un élément qui pourrait changer la page
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        setTimeout(calculatePosition, 100);
      }
    });
  }, 100);
  
  // Événement spécial pour recalculer après que tous les éléments sont chargés
  window.addEventListener('load', function() {
    calculatePosition();
    updateFixedState(window.scrollY);
  });
})();

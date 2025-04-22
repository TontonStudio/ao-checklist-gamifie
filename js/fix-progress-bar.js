/**
 * Correctif pour la barre de progression fixe
 * Version finale - comporte correct comme dans l'ancienne version
 */
document.addEventListener('DOMContentLoaded', function() {
  // Obtenir les références aux éléments DOM nécessaires
  const progressWrapper = document.getElementById('progress-wrapper');
  const progressSpacer = document.getElementById('progress-spacer');
  
  // Désactiver la méthode conflictuelle dans TasksManager
  if (window.TasksManager) {
    TasksManager.handleProgressBarScroll = function() {
      // Cette fonction est désactivée pour éviter les conflits
    };
  }
  
  // Variables pour la détection de position
  let progressWrapperPos = 0;
  let headerHeight = 0;
  
  // Calcul initial des positions
  function calculatePositions() {
    if (progressWrapper) {
      const header = document.querySelector('header');
      if (header) {
        headerHeight = header.offsetHeight;
      }
      
      // Position initiale de la barre par rapport au haut de la page
      progressWrapperPos = progressWrapper.getBoundingClientRect().top + window.scrollY;
    }
  }
  
  // Fonction de gestion du défilement
  function handleScroll() {
    if (!progressWrapper || !progressSpacer) return;
    
    // Position actuelle de défilement
    const scrollPos = window.scrollY;
    
    // Si la barre n'est plus visible (son haut est au niveau ou au-dessus du haut de l'écran)
    if (scrollPos >= progressWrapperPos) {
      // Appliquer le mode fixe si ce n'est pas déjà fait
      if (!progressWrapper.classList.contains('fixed')) {
        // Définir la hauteur du spacer pour éviter les sauts
        progressSpacer.style.height = progressWrapper.offsetHeight + 'px';
        
        // Définir la largeur de la barre fixée
        const activeContainer = document.querySelector('.gameboy-container:not([style*="display: none"])');
        if (activeContainer) {
          const containerWidth = activeContainer.offsetWidth;
          const paddingAdjustment = 40; // Ajustement pour le padding
          progressWrapper.style.width = (containerWidth - paddingAdjustment) + 'px';
        }
        
        // Activer la position fixe
        progressWrapper.classList.add('fixed');
        progressSpacer.classList.add('active');
      }
    } else {
      // Si on est revenu au-dessus, retirer le mode fixe
      progressWrapper.classList.remove('fixed');
      progressSpacer.classList.remove('active');
      progressWrapper.style.width = '';
    }
  }
  
  // Initialisation et événements
  window.addEventListener('load', function() {
    // Calculer les positions une fois que tout est chargé
    calculatePositions();
    
    // Vérifier immédiatement si la barre doit être fixée
    handleScroll();
    
    // Recalculer les positions lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
      calculatePositions();
      handleScroll();
    });
  });
  
  // Événement de défilement
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Première exécution après un court délai
  setTimeout(function() {
    calculatePositions();
    handleScroll();
  }, 100);
});
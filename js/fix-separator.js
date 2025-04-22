/**
 * Script correctif pour remplacer tout séparateur vert
 * par un séparateur rouge en mode warning
 */
(function() {
  // Attendre que tout le document soit chargé
  document.addEventListener('DOMContentLoaded', function() {
    // Observer les changements de classe sur le body pour détecter le mode warning
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          checkWarningMode();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // Vérifier l'état initial
    checkWarningMode();
    
    // Fonction pour vérifier si le mode warning est actif
    function checkWarningMode() {
      if (document.body.classList.contains('warning-mode')) {
        fixSeparators();
      }
    }
    
    // Fonction pour corriger les séparateurs
    function fixSeparators() {
      // Ajouter un séparateur rouge en CSS
      const style = document.createElement('style');
      style.id = 'warning-separator-fix';
      style.textContent = `
        /* Créer un séparateur rouge sous le compteur */
        .warning-mode #countdown-container::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background-color: #990000;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        
        /* Cibler toute bordure horizontale visible */
        .warning-mode #task-list > * {
          border-top-color: #990000 !important;
        }
        
        /* Masquer tout séparateur vert potentiel */
        .warning-mode #task-list::before {
          display: none !important;
        }
        
        /* Ajouter une bordure rouge à la fin du header */
        .warning-mode header {
          border-bottom-color: #990000 !important;
        }
        
        /* Ajouter une bordure au début du contenu principal */
        .warning-mode #task-list {
          border-top: 2px solid #990000 !important;
        }
      `;
      
      // Ne l'ajouter que s'il n'existe pas déjà
      if (!document.getElementById('warning-separator-fix')) {
        document.head.appendChild(style);
      }
    }
  });
})();

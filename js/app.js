/**
 * Fichier principal de l'application
 * Initialisation et gestion des événements principaux
 */

// Utiliser un chargement asynchrone pour ne pas bloquer le rendu
const initApp = () => {
  // Éléments DOM pour la page d'accueil
  const tasksFileInput = document.getElementById('tasks-file');
  const fileNameDisplay = document.getElementById('file-name');
  const fileErrorMessage = document.getElementById('file-error-message');
  
  // Éléments DOM pour la checklist
  const resetBtn = document.getElementById('reset-btn');
  const returnHomeBtn = document.getElementById('return-home-btn');
  
  // Vérifier s'il y a des données sauvegardées
  let savedAoConfig, savedTasks, savedProgress;
  
  try {
    savedAoConfig = localStorage.getItem('tontonAoConfigData');
    savedTasks = localStorage.getItem('tontonAoTasksData');
    savedProgress = localStorage.getItem(APP_CONFIG.storageKey);
  } catch (e) {
    // Gérer les erreurs de localStorage (ex: navigation privée)
    if (APP_CONFIG.debug) {
      console.error('Erreur lors de l\'accès à localStorage:', e);
    }
    
    // Réinitialiser les valeurs en cas d'erreur
    savedAoConfig = null;
    savedTasks = null;
    savedProgress = null;
  }
  
  // Assurer que les états globaux sont réinitialisés au chargement de la page
  document.body.classList.remove('warning-mode', 'golden-mode');
  
  // Utiliser requestAnimationFrame pour les opérations DOM groupées
  requestAnimationFrame(() => {
    document.querySelectorAll('.gameboy-container').forEach(container => {
      container.classList.remove('warning-mode', 'golden-mode');
    });
  });
  
  if (savedAoConfig && savedTasks) {
    try {
      // Restaurer les données
      window.aoConfig = JSON.parse(savedAoConfig);
      window.tasks = JSON.parse(savedTasks);
      
      // Mettre à jour l'interface
      Utils.updateMarketInfo();
      
      // Afficher l'écran de checklist
      document.getElementById('welcome-screen').style.display = 'none';
      document.getElementById('checklist-screen').style.display = 'block';
      
      // Initialiser les tâches, puis mettre à jour la progression
      if (savedProgress) {
        try {
          TasksManager.savedProgress = JSON.parse(savedProgress);
        } catch (e) {
          // En cas d'erreur, utiliser un objet vide
          TasksManager.savedProgress = {};
        }
      }
      
      // Initialiser l'application de manière différée pour ne pas bloquer le rendu
      requestIdleCallback(() => {
        TasksManager.init();
        TasksManager.updateOverallProgress();
        
        // Démarrer le compte à rebours si une date est définie
        if (window.aoConfig.deadline) {
          // Initialisation différée du compte à rebours
          setTimeout(() => {
            CountdownManager.startCountdown(new Date(window.aoConfig.deadline));
          }, 100);
        }
      });
    } catch (error) {
      // En cas d'erreur, supprimer les données corrompues
      if (APP_CONFIG.debug) {
        console.error('Erreur lors de l\'initialisation:', error);
      }
      
      localStorage.removeItem('tontonAoConfigData');
      localStorage.removeItem('tontonAoTasksData');
    }
  }
  
  // Gestionnaire d'événement pour le champ de fichier
  tasksFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
      fileNameDisplay.textContent = file.name;
      fileErrorMessage.textContent = '';
      
      // Lire le contenu du fichier
      const reader = new FileReader();
      reader.onload = function(event) {
        const content = event.target.result;
        
        // Valider le format du fichier
        if (Utils.validateTasksFile(content)) {
          // Charger automatiquement le fichier dès qu'il est validé
          Utils.loadTasksAndConfig(content);
        } else {
          fileErrorMessage.textContent = APP_CONFIG.messages.fileError;
        }
      };
      
      reader.onerror = function() {
        fileErrorMessage.textContent = "Erreur lors de la lecture du fichier.";
      };
      
      reader.readAsText(file);
    } else {
      fileNameDisplay.textContent = "Aucun fichier sélectionné";
    }
  });
  
  // Utiliser la délégation d'événements pour les boutons principaux
  document.addEventListener('click', function(e) {
    // Bouton de réinitialisation
    if (e.target === resetBtn) {
      TasksManager.resetProgress();
    }
    
    // Bouton de retour à l'accueil
    if (e.target === returnHomeBtn) {
      TasksManager.returnToHome();
    }
  });
  
  // Précharger les effets visuels dans un moment d'inactivité
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      if (EffectsManager && typeof EffectsManager.initParticlePool === 'function') {
        EffectsManager.initParticlePool();
      }
    });
  } else {
    // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
    setTimeout(() => {
      if (EffectsManager && typeof EffectsManager.initParticlePool === 'function') {
        EffectsManager.initParticlePool();
      }
    }, 1000);
  }
};

// Initialiser l'application dès que possible sans bloquer le rendu
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Ajouter un gestionnaire pour les événements de visibilité de page
document.addEventListener('visibilitychange', () => {
  // Optimisation: pause des animations quand la page n'est pas visible
  if (document.hidden) {
    // Mettre en pause les animations intensives
    if (EffectsManager && EffectsManager.fireworksInterval) {
      EffectsManager.stopContinuousFireworks();
      document.body.setAttribute('data-paused-fireworks', 'true');
    }
  } else {
    // Reprendre les animations si nécessaire
    if (document.body.getAttribute('data-paused-fireworks') === 'true') {
      if (TasksManager && TasksManager.isComplete && EffectsManager) {
        EffectsManager.startContinuousFireworks();
      }
      document.body.removeAttribute('data-paused-fireworks');
    }
  }
});
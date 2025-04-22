/**
 * Fichier principal de l'application
 * Initialisation et gestion des événements principaux
 */
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM pour la page d'accueil
  const tasksFileInput = document.getElementById('tasks-file');
  const fileNameDisplay = document.getElementById('file-name');
  const fileErrorMessage = document.getElementById('file-error-message');
  
  // Éléments DOM pour la checklist
  const resetBtn = document.getElementById('reset-btn');
  const returnHomeBtn = document.getElementById('return-home-btn');
  
  // Vérifier s'il y a des données sauvegardées
  const savedAoConfig = localStorage.getItem('tontonAoConfigData');
  const savedTasks = localStorage.getItem('tontonAoTasksData');
  const savedProgress = localStorage.getItem(APP_CONFIG.storageKey);
  
  // Assurer que les états globaux sont réinitialisés au chargement de la page
  document.body.classList.remove('warning-mode', 'golden-mode');
  document.querySelectorAll('.gameboy-container').forEach(container => {
    container.classList.remove('warning-mode', 'golden-mode');
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
      
      // Réinitialiser la progression si elle existe
      if (savedProgress) {
        TasksManager.savedProgress = JSON.parse(savedProgress);
      }
      
      // Initialiser les tâches et l'état
      TasksManager.initTasks();
      TasksManager.updateOverallProgress();
      
      // Démarrer le compte à rebours si une date est définie
      if (window.aoConfig.deadline) {
        // Réinitialiser complètement le compte à rebours pour éviter des états incohérents
        const countdownContainer = document.getElementById('countdown-container');
        const countdownTimer = document.getElementById('countdown-timer');
        const countdownMessage = document.getElementById('countdown-message');
        
        // Réinitialiser visuellement les éléments
        countdownContainer.classList.remove('warning-mode');
        countdownMessage.classList.remove('countdown-warning');
        countdownMessage.textContent = '';
        
        // Arrêter tout son d'avertissement
        const warningSound = document.getElementById('warning-sound');
        if (warningSound) {
          warningSound.pause();
          warningSound.currentTime = 0;
        }
        
        // Démarrer un nouveau compte à rebours
        CountdownManager.startCountdown(new Date(window.aoConfig.deadline));
      }
    } catch (error) {
      // En cas d'erreur, supprimer les données corrompues
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
  
  // Gestionnaire d'événement pour le bouton de réinitialisation
  resetBtn.addEventListener('click', function() {
    TasksManager.resetProgress();
  });
  
  // Gestionnaire d'événement pour le bouton de retour à l'accueil
  returnHomeBtn.addEventListener('click', function() {
    TasksManager.returnToHome();
  });
});
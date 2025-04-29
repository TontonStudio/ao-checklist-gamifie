/**
 * Fonctions utilitaires pour l'application (optimisées)
 */
const Utils = {
  // Cache des éléments DOM fréquemment utilisés
  domCache: {
    marketTitle: null,
    progressFill: null,
    progressText: null,
    fileErrorMessage: null,
    warningSound: null,
    soundToggle: null,
    gameContainers: null,
    countdownElements: null
  },
  
  // Plus besoin de cache d'expressions régulières puisqu'on traite directement du JSON
  
  // Initialisation du cache DOM
  initDomCache: function() {
    this.domCache.marketTitle = document.getElementById('market-title');
    this.domCache.progressFill = document.getElementById('progress-fill');
    this.domCache.progressText = document.getElementById('progress-text');
    this.domCache.fileErrorMessage = document.getElementById('file-error-message');
    this.domCache.warningSound = document.getElementById('warning-sound');
    this.domCache.soundToggle = document.getElementById('sound-toggle');
    this.domCache.gameContainers = document.querySelectorAll('.gameboy-container');
    this.domCache.countdownElements = document.querySelectorAll('.countdown-container, .countdown-message, .countdown-timer');
  },
  
  /**
   * Copie un texte dans le presse-papier
   * @param {string} text - Texte à copier
   */
  copyToClipboard: function(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Trouver uniquement les boutons correspondant au texte copié pour réduire les opérations DOM
      const matchingBtns = document.querySelectorAll(`.copy-btn[data-filename="${text}"], .subtask-copy-btn[data-filename="${text}"]`);
      
      if (matchingBtns.length === 0) return;
      
      // Utiliser un ensemble d'animations groupées avec requestAnimationFrame
      requestAnimationFrame(() => {
        matchingBtns.forEach(btn => {
          const originalText = btn.textContent;
          
          // Stocker la largeur actuelle pour éviter les reflows
          if (!btn.dataset.originalWidth) {
            const currentWidth = btn.offsetWidth;
            btn.dataset.originalWidth = `${currentWidth}px`;
            btn.style.width = `${currentWidth}px`;
            btn.style.minWidth = `${currentWidth}px`;
          }
          
          // Appliquer l'animation et le texte en une seule opération
          btn.textContent = 'Copié !';
          btn.classList.add('copy-success');
          
          // Utiliser setTimeout pour la restauration
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copy-success');
            
            // Nettoyer les dimensions
            setTimeout(() => {
              if (btn.dataset.originalWidth) {
                btn.style.width = '';
                btn.style.minWidth = '';
                delete btn.dataset.originalWidth;
              }
            }, 100);
          }, 1500);
        });
      });
    }).catch(err => {
      // Silencieux en production
      if (APP_CONFIG.debug) {
        console.error('Erreur lors de la copie :', err);
      }
    });
  },
  
  /**
   * Formate une date au format jours, heures, minutes, secondes (optimisé)
   * @param {Date} deadline - Date limite
   * @returns {Object} - Objet contenant les jours, heures, minutes, secondes
   */
  formatTimeRemaining: function(deadline) {
    const now = Date.now();
    const target = deadline.getTime ? deadline.getTime() : deadline;
    const diff = target - now;
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    
    // Calcul direct sans conversions inutiles
    const days = Math.floor(diff / 86400000); // 1000 * 60 * 60 * 24
    const hours = Math.floor((diff % 86400000) / 3600000); // 1000 * 60 * 60
    const minutes = Math.floor((diff % 3600000) / 60000); // 1000 * 60
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return { days, hours, minutes, seconds, total: diff };
  },
  
  /**
   * Vérifie le format du fichier JSON chargé
   * @param {string} content - Contenu du fichier JSON
   * @returns {boolean} - true si le format est valide, false sinon
   */
  validateTasksFile: function(content) {
    try {
      // Tenter d'analyser le JSON
      const data = JSON.parse(content);
      
      // Vérifier la présence et le format de la clé aoConfig
      if (!data.aoConfig || typeof data.aoConfig !== 'object' || 
          !data.aoConfig.title || !data.aoConfig.deadline) {
        return false;
      }
      
      // Vérifier la présence et le format de la clé tasks
      if (!data.tasks || !Array.isArray(data.tasks) || data.tasks.length === 0) {
        return false;
      }
      
      // Validation des tâches
      for (let i = 0; i < data.tasks.length; i++) {
        const task = data.tasks[i];
        if (!task.label || !Array.isArray(task.subtasks) || task.subtasks.length === 0) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Charge les tâches et la configuration depuis le contenu du fichier JSON
   * @param {string} content - Contenu du fichier JSON
   */
  loadTasksAndConfig: function(content) {
    try {
      // Initialiser le cache DOM si ce n'est pas déjà fait
      if (!this.domCache.marketTitle) {
        this.initDomCache();
      }
      
      // Réinitialiser l'état de l'application en une seule opération
      requestAnimationFrame(() => {
        // Réinitialiser les classes
        document.body.classList.remove('warning-mode');
        document.body.setAttribute('data-warning-mode', 'false');
        
        this.domCache.gameContainers.forEach(container => {
          container.classList.remove('warning-mode', 'golden-mode');
        });
        
        // Réinitialiser la barre de progression
        if (this.domCache.progressFill) {
          this.domCache.progressFill.style.width = '0%';
          this.domCache.progressFill.classList.remove('completed');
        }
        
        if (this.domCache.progressText) {
          this.domCache.progressText.textContent = '0%';
        }
        
        // Réinitialiser spécifiquement le wrapper de la barre de progression
        const progressWrapper = document.getElementById('progress-wrapper');
        if (progressWrapper) {
          progressWrapper.classList.remove('fixed', 'warning-mode');
          progressWrapper.style.backgroundColor = '';
          progressWrapper.style.borderColor = '';
          progressWrapper.style.width = '';
        }
        
        // Réinitialiser le spacer de la barre de progression
        const progressSpacer = document.getElementById('progress-spacer');
        if (progressSpacer) {
          progressSpacer.classList.remove('active');
          progressSpacer.style.backgroundColor = '';
          progressSpacer.style.height = '';
        }
        
        // Arrêter les sons
        if (this.domCache.warningSound) {
          this.domCache.warningSound.pause();
          this.domCache.warningSound.currentTime = 0;
        }
        
        // Réinitialiser les éléments countdown
        this.domCache.countdownElements.forEach(element => {
          element.classList.remove('warning-mode', 'countdown-warning');
          if (element.classList.contains('countdown-message')) {
            element.textContent = '';
          }
        });
      });
      
      // Réinitialiser l'état du CountdownManager
      if (CountdownManager) {
        CountdownManager.warningActive = false;
        
        if (this.domCache.soundToggle) {
          this.domCache.soundToggle.style.display = 'none';
        }
        
        if (CountdownManager.interval) {
          clearInterval(CountdownManager.interval);
          CountdownManager.interval = null;
        }
      }
      
      // Réinitialiser les tâches
      localStorage.removeItem(APP_CONFIG.storageKey);
      if (TasksManager) {
        TasksManager.savedProgress = {};
        TasksManager.isComplete = false;
      }
      
      // Analyser le fichier JSON
      const jsonData = JSON.parse(content);
      
      // Extraire les données
      const extractedAoConfig = jsonData.aoConfig;
      const extractedTasks = jsonData.tasks;
      
      if (!extractedAoConfig || !extractedTasks) {
        throw new Error("Impossible d'extraire aoConfig ou tasks du JSON");
      }
      
      // Définir les variables globales
      window.aoConfig = extractedAoConfig;
      window.tasks = extractedTasks;
      
      // Sauvegarder dans localStorage de manière optimisée
      try {
        // Stocker les données dans un try-catch pour gérer les erreurs de quotas
        localStorage.setItem('tontonAoTasks', content);
        localStorage.setItem('tontonAoConfigData', JSON.stringify(extractedAoConfig));
        localStorage.setItem('tontonAoTasksData', JSON.stringify(extractedTasks));
      } catch (storageError) {
        // Fallback silencieux si localStorage n'est pas disponible
        if (APP_CONFIG.debug) {
          console.warn('Erreur de stockage localStorage :', storageError);
        }
      }
      
      // Mettre à jour l'interface
      this.updateMarketInfo();
      
      // Afficher l'écran de checklist
      document.getElementById('welcome-screen').style.display = 'none';
      document.getElementById('checklist-screen').style.display = 'block';
      
      // Initialiser de manière différée
      requestIdleCallback(() => {
        // Réinitialiser complètement la barre de progression fixe si la fonction existe
        if (window.resetProgressBarState) {
          window.resetProgressBarState();
        }
        
        // Initialiser les tâches
        if (TasksManager && TasksManager.initTasks) {
          TasksManager.init();
        }
        
        // Démarrer le compte à rebours si une date est définie
        if (extractedAoConfig.deadline && CountdownManager && CountdownManager.startCountdown) {
          setTimeout(() => {
            CountdownManager.startCountdown(new Date(extractedAoConfig.deadline));
          }, 100);
        }
      });
    } catch (error) {
      if (this.domCache.fileErrorMessage) {
        this.domCache.fileErrorMessage.textContent = APP_CONFIG.messages.fileError;
      } else {
        document.getElementById('file-error-message').textContent = APP_CONFIG.messages.fileError;
      }
      
      if (APP_CONFIG.debug) {
        console.error('Erreur de chargement :', error);
      }
    }
  },
  
  /**
   * Met à jour les informations du marché dans l'interface (optimisé)
   */
  updateMarketInfo: function() {
    if (!window.aoConfig) return;
    
    // Initialiser le cache DOM si ce n'est pas déjà fait
    if (!this.domCache.marketTitle) {
      this.initDomCache();
    }
    
    // Mettre à jour le titre du marché
    if (window.aoConfig.title && this.domCache.marketTitle) {
      this.domCache.marketTitle.textContent = window.aoConfig.title;
      this.domCache.marketTitle.style.display = 'block';
    }
    
    // Mettre à jour le titre de la page en une seule opération
    if (window.aoConfig.reference) {
      document.title = `AO ${window.aoConfig.reference} - Tonton Studio`;
    }
  }
};

// Initialiser le cache DOM dès que possible sans bloquer le rendu
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestIdleCallback(() => Utils.initDomCache());
  });
} else {
  requestIdleCallback(() => Utils.initDomCache());
}
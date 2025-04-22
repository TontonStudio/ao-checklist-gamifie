/**
 * Fonctions utilitaires pour l'application
 */
const Utils = {
  /**
   * Copie un texte dans le presse-papier
   * @param {string} text - Texte à copier
   */
  copyToClipboard: function(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Feedback visuel pour tous les boutons de copie
      const allCopyBtns = document.querySelectorAll('.copy-btn, .subtask-copy-btn');
      allCopyBtns.forEach(btn => {
        if (btn.dataset.filename === text) {
          const originalText = btn.textContent;
          
          // Stocker la largeur actuelle du bouton pour la préserver
          const currentWidth = btn.offsetWidth;
          const currentHeight = btn.offsetHeight;
          
          // Appliquer une largeur fixe temporaire pour éviter le redimensionnement
          if (!btn.dataset.originalWidth) {
            btn.dataset.originalWidth = `${currentWidth}px`;
            btn.dataset.originalHeight = `${currentHeight}px`;
            btn.style.width = `${currentWidth}px`;
            btn.style.minWidth = `${currentWidth}px`;
          }
          
          // Changer le texte pour indiquer la copie
          btn.textContent = 'Copié !';
          
          // Ajouter une classe pour l'animation de succès
          btn.classList.add('copy-success');
          
          // Rétablir le texte original après un délai
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copy-success');
            
            // Retirer la largeur fixe après que le texte soit revenu à l'original
            setTimeout(() => {
              if (btn.dataset.originalWidth) {
                btn.style.width = '';
                btn.style.minWidth = '';
                delete btn.dataset.originalWidth;
                delete btn.dataset.originalHeight;
              }
            }, 100);
          }, 1500);
        }
      });
    }).catch(err => {
      console.error('Erreur lors de la copie dans le presse-papier:', err);
    });
  },
  
  /**
   * Formate une date au format jours, heures, minutes, secondes
   * @param {Date} deadline - Date limite
   * @returns {Object} - Objet contenant les jours, heures, minutes, secondes
   */
  formatTimeRemaining: function(deadline) {
    const now = new Date();
    const diff = deadline - now;
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return {
      days,
      hours,
      minutes,
      seconds,
      total: diff
    };
  },
  
  /**
   * Vérifie le format du fichier chargé - version améliorée pour plus de souplesse
   * @param {string} content - Contenu du fichier
   * @returns {boolean} - true si le format est valide, false sinon
   */
  validateTasksFile: function(content) {
    try {
      console.log("Validation du fichier tasks.js...");
      
      // Vérification de base : le fichier doit contenir certains mots-clés
      const hasAoConfig = content.includes('aoConfig');
      const hasTasks = content.includes('tasks');
      const hasLabel = content.includes('label');
      const hasSubtasks = content.includes('subtasks');
      
      if (!hasAoConfig || !hasTasks || !hasLabel || !hasSubtasks) {
        console.error("Le fichier ne contient pas les structures nécessaires");
        return false;
      }
      
      // Expressions régulières améliorées avec plus de souplesse
      const aoConfigRegexes = [
        /const\s+aoConfig\s*=\s*({[\s\S]*?});/,
        /let\s+aoConfig\s*=\s*({[\s\S]*?});/,
        /var\s+aoConfig\s*=\s*({[\s\S]*?});/,
        /aoConfig\s*=\s*({[\s\S]*?});/
      ];
      
      const tasksRegexes = [
        /const\s+tasks\s*=\s*(\[[\s\S]*?\]);/,
        /let\s+tasks\s*=\s*(\[[\s\S]*?\]);/,
        /var\s+tasks\s*=\s*(\[[\s\S]*?\]);/,
        /tasks\s*=\s*(\[[\s\S]*?\]);/
      ];
      
      // Tester chaque expression régulière jusqu'à trouver un match
      let aoConfigMatch = null;
      for (const regex of aoConfigRegexes) {
        const match = content.match(regex);
        if (match && match[1]) {
          aoConfigMatch = match;
          break;
        }
      }
      
      let tasksMatch = null;
      for (const regex of tasksRegexes) {
        const match = content.match(regex);
        if (match && match[1]) {
          tasksMatch = match;
          break;
        }
      }
      
      if (!aoConfigMatch || !tasksMatch) {
        console.error("Impossible d'extraire aoConfig ou tasks");
        return false;
      }
      
      // Utiliser une approche plus simple pour valider
      try {
        // Extraire et évaluer la configuration
        const aoConfigJson = aoConfigMatch[1]
          .replace(/\/\/.*/g, '') // Supprimer les commentaires inline
          .replace(/\/\*[\s\S]*?\*\//g, ''); // Supprimer les commentaires multi-lignes
        
        const tasksJson = tasksMatch[1]
          .replace(/\/\/.*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Test d'évaluation
        const evalAoConfig = new Function('return ' + aoConfigJson)();
        const evalTasks = new Function('return ' + tasksJson)();
        
        // Vérifier les propriétés minimales requises
        if (!evalAoConfig.title || !evalAoConfig.deadline) {
          console.error("aoConfig ne contient pas title ou deadline");
          return false;
        }
        
        if (!Array.isArray(evalTasks) || evalTasks.length === 0) {
          console.error("tasks n'est pas un tableau ou est vide");
          return false;
        }
        
        // Vérifier que chaque tâche a un label et des sous-tâches
        for (const task of evalTasks) {
          if (!task.label || !Array.isArray(task.subtasks)) {
            console.error("Une tâche n'a pas de label ou de subtasks");
            return false;
          }
        }
        
        console.log("Validation réussie !");
        return true;
      } catch (evalError) {
        console.error('Erreur lors de l\'évaluation du contenu:', evalError);
        return false;
      }
    } catch (error) {
      console.error('Erreur générale de validation du fichier:', error);
      return false;
    }
  },
  
  /**
   * Charge les tâches et la configuration depuis le contenu du fichier
   * @param {string} content - Contenu du fichier
   */
  loadTasksAndConfig: function(content) {
    try {
      console.log("Chargement des tâches et de la configuration...");
      
      // Réinitialiser complètement l'état de l'application d'abord
      // Supprimer les modes warning et doré
      document.body.classList.remove('warning-mode');
      document.querySelectorAll('.gameboy-container').forEach(container => {
        container.classList.remove('warning-mode', 'golden-mode');
      });
      
      // Réinitialiser la barre de progression
      const progressFill = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      if (progressFill) {
        progressFill.style.width = '0%';
        progressFill.classList.remove('completed');
      }
      if (progressText) {
        progressText.textContent = '0%';
      }
      
      // Arrêter les sons et animations
      const warningSound = document.getElementById('warning-sound');
      if (warningSound) {
        warningSound.pause();
        warningSound.currentTime = 0;
      }
      
      // Réinitialiser l'état d'avertissement
      if (CountdownManager) {
        // Désactiver explicitement le mode warning
        CountdownManager.warningActive = false;
        
        // Masquer le bouton de musique si disponible
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
          soundToggle.style.display = 'none';
        }
        
        // Arrêter le compte à rebours existant
        if (CountdownManager.interval) {
          clearInterval(CountdownManager.interval);
          CountdownManager.interval = null;
        }
        
        // Arrêter le son d'avertissement s'il joue
        if (warningSound) {
          warningSound.pause();
          warningSound.currentTime = 0;
        }
        
        // Force la suppression du mode warning sur tous les éléments
        document.body.classList.remove('warning-mode');
        document.querySelectorAll('.gameboy-container').forEach(container => {
          container.classList.remove('warning-mode');
        });
        
        // Nettoyer tous les éléments d'avertissement
        document.querySelectorAll('.countdown-container, .countdown-message, .countdown-timer').forEach(element => {
          element.classList.remove('warning-mode', 'countdown-warning');
          if (element.classList.contains('countdown-message')) {
            element.textContent = '';
          }
        });
      }
      
      // Réinitialiser la progression
      localStorage.removeItem(APP_CONFIG.storageKey);
      if (TasksManager) {
        TasksManager.savedProgress = {};
        TasksManager.isComplete = false;
      }
      
      // Expressions régulières améliorées pour extraire aoConfig et tasks
      const aoConfigRegexes = [
        /const\s+aoConfig\s*=\s*({[\s\S]*?});/,
        /let\s+aoConfig\s*=\s*({[\s\S]*?});/,
        /var\s+aoConfig\s*=\s*({[\s\S]*?});/,
        /aoConfig\s*=\s*({[\s\S]*?});/
      ];
      
      const tasksRegexes = [
        /const\s+tasks\s*=\s*(\[[\s\S]*?\]);/,
        /let\s+tasks\s*=\s*(\[[\s\S]*?\]);/,
        /var\s+tasks\s*=\s*(\[[\s\S]*?\]);/,
        /tasks\s*=\s*(\[[\s\S]*?\]);/
      ];
      
      // Trouver le match pour aoConfig
      let aoConfigMatch = null;
      for (const regex of aoConfigRegexes) {
        const match = content.match(regex);
        if (match && match[1]) {
          aoConfigMatch = match;
          break;
        }
      }
      
      // Trouver le match pour tasks
      let tasksMatch = null;
      for (const regex of tasksRegexes) {
        const match = content.match(regex);
        if (match && match[1]) {
          tasksMatch = match;
          break;
        }
      }
      
      if (!aoConfigMatch || !tasksMatch) {
        throw new Error("Impossible d'extraire aoConfig ou tasks");
      }
      
      // Extraire et nettoyer les données
      let extractedAoConfig = {};
      let extractedTasks = [];
      
      try {
        // Convertir le texte en objet/tableau JavaScript en supprimant les commentaires
        const aoConfigJson = aoConfigMatch[1]
          .replace(/\/\/.*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '');
          
        const tasksJson = tasksMatch[1]
          .replace(/\/\/.*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '');
        
        extractedAoConfig = (new Function('return ' + aoConfigJson))();
        extractedTasks = (new Function('return ' + tasksJson))();
        
        console.log("Extraction réussie:", {
          config: extractedAoConfig,
          tasksCount: extractedTasks.length
        });
      } catch (e) {
        console.error('Erreur lors du parsing des données:', e);
        throw e;
      }
      
      // Définir les variables globales pour l'application
      window.aoConfig = extractedAoConfig;
      window.tasks = extractedTasks;
      
      // Sauvegarder le contenu dans localStorage pour persistance
      localStorage.setItem('tontonAoTasks', content);
      
      // Sauvegarder les données extraites dans localStorage également
      localStorage.setItem('tontonAoConfigData', JSON.stringify(extractedAoConfig));
      localStorage.setItem('tontonAoTasksData', JSON.stringify(extractedTasks));
      
      // Mettre à jour l'interface
      this.updateMarketInfo();
      
      // Afficher l'écran de checklist
      document.getElementById('welcome-screen').style.display = 'none';
      document.getElementById('checklist-screen').style.display = 'block';
      
      // Initialiser les tâches
      if (TasksManager && TasksManager.initTasks) {
        TasksManager.initTasks();
      } else {
        console.error("TasksManager non disponible");
      }
      
      // Démarrer le compte à rebours si une date est définie
      if (extractedAoConfig.deadline && CountdownManager && CountdownManager.startCountdown) {
        console.log("Démarrage du compte à rebours pour:", extractedAoConfig.deadline);
        CountdownManager.startCountdown(new Date(extractedAoConfig.deadline));
      }
      
      console.log("Chargement terminé avec succès");
      
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      document.getElementById('file-error-message').textContent = APP_CONFIG.messages.fileError;
    }
  },
  
  /**
   * Met à jour les informations du marché dans l'interface
   */
  updateMarketInfo: function() {
    if (window.aoConfig) {
      // Mettre à jour le titre du marché s'il existe
      if (window.aoConfig.title) {
        const marketTitle = document.getElementById('market-title');
        if (marketTitle) {
          marketTitle.textContent = window.aoConfig.title;
          marketTitle.style.display = 'block';
        }
      }
      
      // Mettre à jour le titre de la page
      if (window.aoConfig.reference) {
        document.title = `AO ${window.aoConfig.reference} - Tonton Studio`;
      }
    }
  }
};

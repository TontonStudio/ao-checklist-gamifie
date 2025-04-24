/**
 * Gestion des tâches et de la progression
 */
const TasksManager = {
  // Éléments DOM fréquemment utilisés (mis en cache)
  taskList: document.getElementById('task-list'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  progressWrapper: document.getElementById('progress-wrapper'),
  progressSpacer: document.getElementById('progress-spacer'),
  gameContainer: document.querySelector('.gameboy-container'),
  logoContainer: document.querySelector('.logo-container'),
  completionMessage: document.getElementById('completion-message'),
  
  // État de l'application
  savedProgress: {},
  isComplete: false,
  saveDebounceTimer: null,
  updateProgressDebounceTimer: null,
  taskElements: new Map(), // Cache des éléments DOM pour les tâches
  
  /**
   * Initialise l'application
   */
  init: function() {
    // Charger la progression sauvegardée
    this.loadProgress();
    
    // Initialiser les tâches
    this.initTasks();
    
    // Mettre à jour la progression globale
    this.updateOverallProgress();
    
    // Ajouter la délégation d'événements optimisée
    this.setupEventDelegation();
  },
  
  /**
   * Configure la délégation d'événements pour réduire le nombre d'écouteurs
   */
  setupEventDelegation: function() {
    if (!this.taskList) return;
    
    // Un seul écouteur pour tous les clics dans la liste des tâches
    this.taskList.addEventListener('click', (e) => {
      const target = e.target;
      
      // Gestion des en-têtes de tâche (accordéon)
      const taskHeader = target.closest('.task-header');
      if (taskHeader && !target.classList.contains('task-main-checkbox')) {
        const taskItem = taskHeader.closest('.task-item');
        if (taskItem) {
          taskItem.classList.toggle('open');
          e.stopPropagation();
          return;
        }
      }
      
      // Gestion des sous-tâches
      const subtask = target.closest('.subtask');
      if (subtask && !target.classList.contains('subtask-copy-btn')) {
        const checkbox = subtask.querySelector('.subtask-checkbox');
        if (checkbox && target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          
          // Déclencher manuellement l'événement change
          const changeEvent = new Event('change', { bubbles: true });
          checkbox.dispatchEvent(changeEvent);
          e.stopPropagation();
          return;
        }
      }
      
      // Gestion des boutons de copie
      const copyBtn = target.closest('.subtask-copy-btn, .copy-btn');
      if (copyBtn) {
        const filename = copyBtn.dataset.filename;
        Utils.copyToClipboard(filename);
        e.stopPropagation();
        return;
      }
    });
    
    // Un seul écouteur pour tous les changements de checkbox
    this.taskList.addEventListener('change', (e) => {
      const target = e.target;
      
      // Gestion des checkbox principales
      if (target.classList.contains('task-main-checkbox')) {
        const taskItem = target.closest('.task-item');
        if (taskItem) {
          const isChecked = target.checked;
          const checkboxes = taskItem.querySelectorAll('.subtask-checkbox');
          
          // Optimisation: traiter par lots avec requestAnimationFrame
          requestAnimationFrame(() => {
            checkboxes.forEach(checkbox => {
              if (checkbox.checked !== isChecked) {
                checkbox.checked = isChecked;
                
                // Mettre à jour l'état visuel sans déclencher d'événements
                const subtask = checkbox.closest('.subtask');
                if (subtask) {
                  if (isChecked) {
                    subtask.classList.add('checked-subtask');
                  } else {
                    subtask.classList.remove('checked-subtask');
                  }
                }
              }
            });
            
            // Une seule mise à jour de l'état après avoir changé toutes les cases
            this.batchUpdateSubtasks(taskItem);
          });
        }
        e.stopPropagation();
        return;
      }
      
      // Gestion des checkbox de sous-tâches
      if (target.classList.contains('subtask-checkbox')) {
        this.handleSubtaskChange(e);
      }
    });
  },
  
  /**
   * Mise à jour par lots des sous-tâches pour un élément de tâche
   * @param {HTMLElement} taskElement - Élément de tâche
   */
  batchUpdateSubtasks: function(taskElement) {
    const taskIndex = parseInt(taskElement.dataset.index);
    const checkboxes = taskElement.querySelectorAll('.subtask-checkbox');
    const checkedIndices = [];
    
    // Collecter tous les indices cochés
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const subtaskIndex = parseInt(checkbox.dataset.subtask);
        checkedIndices.push(subtaskIndex);
        
        // Mettre à jour l'état visuel
        const subtask = checkbox.closest('.subtask');
        if (subtask) {
          subtask.classList.add('checked-subtask');
        }
      } else {
        // Mettre à jour l'état visuel
        const subtask = checkbox.closest('.subtask');
        if (subtask) {
          subtask.classList.remove('checked-subtask');
        }
      }
    });
    
    // Mettre à jour la progression sauvegardée
    this.savedProgress[taskIndex] = checkedIndices;
    
    // Différer la sauvegarde pour éviter des écritures trop fréquentes
    this.debouncedSaveProgress();
    
    // Mettre à jour l'interface
    this.updateTaskProgress(taskElement, taskIndex);
    this.debouncedUpdateOverallProgress();
    
    // Jouer le son si nécessaire (mais une seule fois)
    if (checkedIndices.length > 0) {
      EffectsManager.playCheckSound();
    } else {
      EffectsManager.playUncheckSound();
    }
  },
  
  /**
   * Charge la progression sauvegardée
   */
  loadProgress: function() {
    try {
      this.savedProgress = JSON.parse(localStorage.getItem(APP_CONFIG.storageKey)) || {};
    } catch (e) {
      this.savedProgress = {};
      if (APP_CONFIG.debug) {
        console.error('Erreur lors du chargement de la progression:', e);
      }
    }
  },
  
  /**
   * Sauvegarde la progression avec debouncing
   */
  debouncedSaveProgress: function() {
    // Annuler tout timer existant
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    
    // Différer la sauvegarde pour éviter des écritures trop fréquentes
    this.saveDebounceTimer = setTimeout(() => {
      localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(this.savedProgress));
    }, 300);
  },
  
  /**
   * Sauvegarde la progression immédiatement
   */
  saveProgress: function() {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(this.savedProgress));
  },
  
  /**
   * Initialise la liste des tâches
   */
  initTasks: function() {
    // Si tasks n'est pas défini, ne pas continuer
    if (typeof tasks === 'undefined') {
      console.error('La variable tasks n\'est pas définie');
      return;
    }
    
    // Vider le conteneur
    this.taskList.innerHTML = '';
    this.taskElements.clear();
    
    // Créer un fragment de document pour éviter les reflows multiples
    const fragment = document.createDocumentFragment();
    
    tasks.forEach((task, taskIndex) => {
      // Création du conteneur de tâche
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      taskElement.dataset.index = taskIndex;
      
      // Calcul du progrès pour cette tâche
      const subtaskCount = task.subtasks.length;
      let completedCount = 0;
      
      // Vérification des sous-tâches complétées
      const savedSubtasks = this.savedProgress[taskIndex] || [];
      const isCompleted = subtaskCount > 0 && savedSubtasks.length === subtaskCount;
      
      if (isCompleted) {
        taskElement.classList.add('completed');
      } else {
        taskElement.classList.add('open');
      }
      
      // Création de l'en-tête de la tâche
      const taskHeader = document.createElement('div');
      taskHeader.className = 'task-header';
      
      // Vérifier si toutes les sous-tâches sont complétées pour déterminer l'état de la checkbox principale
      const allChecked = subtaskCount > 0 && savedSubtasks.length === subtaskCount;
      
      taskHeader.innerHTML = `
        <div class="task-title-container">
          <input type="checkbox" class="task-main-checkbox" ${allChecked ? 'checked' : ''}>
          <h2>${task.label}</h2>
        </div>
        <div class="task-progress-wrapper">
          <span class="task-progress">${completedCount}/${subtaskCount}</span>
        </div>
      `;
      
      // Ajouter le tag DONE! s'il est complété
      if (isCompleted) {
        const doneTag = document.createElement('span');
        doneTag.className = 'task-done-tag';
        doneTag.textContent = 'DONE!';
        taskHeader.appendChild(doneTag);
      }
      
      // Création du contenu de la tâche
      const taskContent = document.createElement('div');
      taskContent.className = 'task-content';
      
      // Liste des sous-tâches
      const subtasksList = document.createElement('ul');
      subtasksList.className = 'subtasks';
      
      // Création des sous-tâches avec un fragment de document
      const subtasksFragment = document.createDocumentFragment();
      
      task.subtasks.forEach((subtask, subtaskIndex) => {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask';
        
        const isChecked = savedSubtasks.includes(subtaskIndex);
        if (isChecked) completedCount++;
        if (isChecked) subtaskItem.classList.add('checked-subtask');
        
        // Vérifier si la sous-tâche a un nom de fichier associé
        const hasFilename = typeof subtask === 'object' && subtask.filename;
        const subtaskLabel = typeof subtask === 'object' ? subtask.label : subtask;
        const filename = hasFilename ? subtask.filename : null;
        
        // Construire le HTML de la sous-tâche
        let subtaskHTML = `
          <input type="checkbox" class="subtask-checkbox" data-task="${taskIndex}" data-subtask="${subtaskIndex}" ${isChecked ? 'checked' : ''}>
          <div class="subtask-content">
            <span class="subtask-label">${subtaskLabel}</span>
            ${hasFilename ? `<span class="subtask-filename">${filename}</span>` : ''}
          </div>
        `;
        
        // Ajouter un bouton de copie si la sous-tâche a un nom de fichier
        if (hasFilename) {
          subtaskHTML += `
            <button class="subtask-copy-btn" data-filename="${filename}" title="Copier le nom du fichier">
              📋 Copier
            </button>
          `;
        }
        
        subtaskItem.innerHTML = subtaskHTML;
        subtasksFragment.appendChild(subtaskItem);
      });
      
      subtasksList.appendChild(subtasksFragment);
      
      // Mise à jour du compteur
      taskHeader.querySelector('.task-progress').textContent = `${completedCount}/${subtaskCount}`;
      
      // Vérifier si le livrable a des sous-tâches qui sont des fichiers
      const hasSubtaskFiles = task.subtasks.some(subtask => 
        typeof subtask === 'object' && subtask.filename
      );
      
      // Footer pour les informations sur les fichiers
      const taskFooter = document.createElement('div');
      taskFooter.className = 'task-footer';
      
      // Logique de contenu du footer selon le type de livrable
      const isMultiFile = task.isMultiFile === true;
      
      if (isMultiFile || hasSubtaskFiles) {
        // Si le livrable est multi-fichiers ou contient des sous-tâches avec des fichiers
        taskFooter.innerHTML = `
          <div class="info-message">Les fichiers individuels sont accessibles depuis chaque sous-tâche</div>
        `;
      } else if (task.filename) {
        // Si le livrable a un nom de fichier global et n'est pas multi-fichiers
        taskFooter.innerHTML = `
          <div class="filename-display">${task.filename}</div>
          <div class="copy-btn-container">
            <button class="copy-btn" data-filename="${task.filename}">📋 Copier</button>
          </div>
        `;
      } else {
        // Fallback au cas où
        taskFooter.innerHTML = `
          <div class="filename-display">Aucun fichier associé</div>
        `;
      }
      
      // Ajout des éléments à la tâche
      taskContent.appendChild(subtasksList);
      taskElement.appendChild(taskHeader);
      taskElement.appendChild(taskContent);
      taskElement.appendChild(taskFooter);
      
      // Stocker une référence à l'élément DOM pour un accès plus rapide
      this.taskElements.set(taskIndex, taskElement);
      
      // Ajouter au fragment
      fragment.appendChild(taskElement);
    });
    
    // Ajouter le fragment au DOM en une seule opération
    this.taskList.appendChild(fragment);
  },
  
  /**
   * Gère le changement d'état d'une sous-tâche
   * @param {Event} e - Événement
   */
  handleSubtaskChange: function(e) {
    const checkbox = e.target;
    const taskIndex = parseInt(checkbox.dataset.task);
    const subtaskIndex = parseInt(checkbox.dataset.subtask);
    const taskElement = checkbox.closest('.task-item');
    
    // Mise à jour du localStorage
    if (!this.savedProgress[taskIndex]) {
      this.savedProgress[taskIndex] = [];
    }
    
    if (checkbox.checked) {
      // Ajouter la sous-tâche aux complétées
      if (!this.savedProgress[taskIndex].includes(subtaskIndex)) {
        this.savedProgress[taskIndex].push(subtaskIndex);
      }
      
      // Jouer le son de check
      EffectsManager.playCheckSound();
      
      // Mettre à jour visuellement sans manipuler le DOM
      const subtask = checkbox.closest('.subtask');
      if (subtask) {
        subtask.classList.add('checked-subtask');
      }
    } else {
      // Supprimer la sous-tâche des complétées
      this.savedProgress[taskIndex] = this.savedProgress[taskIndex].filter(index => index !== subtaskIndex);
      
      // Jouer le son de uncheck
      EffectsManager.playUncheckSound();
      
      // Mettre à jour visuellement sans manipuler le DOM
      const subtask = checkbox.closest('.subtask');
      if (subtask) {
        subtask.classList.remove('checked-subtask');
      }
      
      // Si le livrable était complété, ouvrir l'accordéon après avoir décoché
      const savedSubtasks = this.savedProgress[taskIndex] || [];
      const subtaskCount = tasks[taskIndex].subtasks.length;
      if (savedSubtasks.length + 1 === subtaskCount) {
        // La tâche vient de passer de complétée à non-complétée
        taskElement.classList.add('open');
      }
    }
    
    // Différer la sauvegarde
    this.debouncedSaveProgress();
    
    // Mise à jour du compteur de progression
    this.updateTaskProgress(taskElement, taskIndex);
    
    // Mise à jour de la progression globale (différée)
    this.debouncedUpdateOverallProgress();
  },
  
  /**
   * Met à jour la progression globale avec debouncing
   */
  debouncedUpdateOverallProgress: function() {
    // Annuler tout timer existant
    if (this.updateProgressDebounceTimer) {
      clearTimeout(this.updateProgressDebounceTimer);
    }
    
    // Différer la mise à jour pour éviter des recalculs trop fréquents
    this.updateProgressDebounceTimer = setTimeout(() => {
      this.updateOverallProgress();
    }, 50);
  },
  
  /**
   * Met à jour la progression d'une tâche spécifique
   * @param {HTMLElement} taskElement - Élément de tâche
   * @param {number} taskIndex - Index de la tâche
   */
  updateTaskProgress: function(taskElement, taskIndex) {
    const task = tasks[taskIndex];
    const subtaskCount = task.subtasks.length;
    const completedSubtasks = this.savedProgress[taskIndex] || [];
    const completedCount = completedSubtasks.length;
    
    // Mise à jour du compteur
    const progressElement = taskElement.querySelector('.task-progress');
    if (progressElement) {
      progressElement.textContent = `${completedCount}/${subtaskCount}`;
    }
    
    // Mise à jour de la checkbox principale
    const mainCheckbox = taskElement.querySelector('.task-main-checkbox');
    if (mainCheckbox) {
      mainCheckbox.checked = (completedCount === subtaskCount && subtaskCount > 0);
    }
    
    // Vérification si la tâche est complète
    if (completedCount === subtaskCount) {
      if (!taskElement.classList.contains('completed')) {
        // Marquer comme complété et fermer l'accordéon
        taskElement.classList.add('completed');
        taskElement.classList.remove('open');
        
        // Ajouter le tag "DONE!" seulement s'il n'existe pas déjà
        const taskHeader = taskElement.querySelector('.task-header');
        if (taskHeader && !taskHeader.querySelector('.task-done-tag')) {
          const doneTag = document.createElement('span');
          doneTag.className = 'task-done-tag';
          doneTag.textContent = 'DONE!';
          taskHeader.appendChild(doneTag);
        }
        
        // Attendre que l'accordéon soit fermé avant de lancer les effets
        setTimeout(() => {
          // Flash blanc d'abord (léger délai pour éviter les pics de performance)
          requestAnimationFrame(() => {
            EffectsManager.createFlash();
            
            // Légère temporisation pour séparer les effets
            setTimeout(() => {
              // Animation et effets
              EffectsManager.createParticleEffect(taskElement);
              EffectsManager.playSuccessSound();
              
              taskElement.classList.add('complete-animation');
              setTimeout(() => {
                taskElement.classList.remove('complete-animation');
              }, 500);
            }, 50);
          });
        }, 300);
      }
    } else {
      taskElement.classList.remove('completed');
      
      // Supprimer le tag "DONE!" s'il existe
      const doneTag = taskElement.querySelector('.task-done-tag');
      if (doneTag) {
        doneTag.remove();
      }
    }
  },
  
  /**
   * Met à jour la barre de progression globale
   */
  updateOverallProgress: function() {
    const totalSubtasks = tasks.reduce((sum, task) => sum + task.subtasks.length, 0);
    let completedTotal = 0;
    
    // Compter toutes les sous-tâches complétées
    Object.values(this.savedProgress).forEach(subtasks => {
      completedTotal += subtasks.length;
    });
    
    // Calculer le pourcentage
    const progressPercentage = totalSubtasks > 0 
      ? Math.round((completedTotal / totalSubtasks) * 100) 
      : 0;
    
    // Mettre à jour l'interface avec requestAnimationFrame pour éviter les reflows forcés
    requestAnimationFrame(() => {
      // Mettre à jour la barre de progression
      this.progressFill.style.width = `${progressPercentage}%`;
      this.progressText.textContent = `${progressPercentage}%`;
      
      // Vérifier si tout est complété (100%)
      if (progressPercentage === 100) {
        // Ajouter la classe 'completed' pour le style doré pour la barre
        this.progressFill.classList.add('completed');
        
        // Si c'est la première fois qu'on atteint 100%
        if (!this.isComplete) {
          this.isComplete = true;
          
          // Si le mode warning est actif, effectuer un fade out de la musique
          if (CountdownManager && CountdownManager.warningActive && typeof SoundControl !== 'undefined') {
            SoundControl.stopWarningSound(true); // Fade out pendant 1 seconde
          }
          
          // Activer le mode doré
          this.activateGoldenMode();
          
          // Effet de flash (après le défilement)
          setTimeout(() => {
            requestAnimationFrame(() => {
              EffectsManager.createFlash();
              
              // Jouer le son de fin
              EffectsManager.playFinishSound();
              
              // Lancer les feux d'artifice continus de manière différée
              setTimeout(() => {
                EffectsManager.startContinuousFireworks();
              }, 200);
            });
          }, 600);
        }
      } else {
        // Si on était à 100% mais qu'on a décoché une tâche
        if (this.isComplete) {
          this.isComplete = false;
          
          // Désactiver le mode doré
          this.deactivateGoldenMode();
          
          // Arrêter les feux d'artifice
          EffectsManager.stopContinuousFireworks();
        }
        
        this.progressFill.classList.remove('completed');
      }
    });
  },
  
  /**
   * Active le mode doré (quand tout est complété)
   */
  activateGoldenMode: function() {
    // Si la barre de progression était fixée, la défixer d'abord
    if (this.progressWrapper && this.progressWrapper.classList.contains('fixed')) {
      this.progressWrapper.classList.remove('fixed');
      if (this.progressSpacer) {
        this.progressSpacer.classList.remove('active');
      }
    }
    
    // Scroller vers le haut en douceur
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Attendre que le défilement soit terminé avant d'activer le mode doré
    setTimeout(() => {
      // Changer les logos et activer le mode doré en une seule opération
      requestAnimationFrame(() => {
        // Mettre à jour les logos
        document.querySelectorAll('.logo').forEach(logo => {
          logo.src = 'img/TTS_Logo_Checked.png';
        });
        
        // Activer le mode doré sur tous les conteneurs
        document.querySelectorAll('.gameboy-container').forEach(container => {
          container.classList.add('golden-mode');
        });
        
        // Assurer que le message de complétion est visible
        if (this.completionMessage) {
          this.completionMessage.style.display = 'block';
        }
        
        // Forcer la recalcul de la barre de progression fixe
        if (window.recalculateProgressBar) {
          window.recalculateProgressBar();
        }
      });
    }, 800);
  },
  
  /**
   * Désactive le mode doré
   */
  deactivateGoldenMode: function() {
    requestAnimationFrame(() => {
      // Désactiver le mode doré sur tous les conteneurs
      document.querySelectorAll('.gameboy-container').forEach(container => {
        container.classList.remove('golden-mode');
      });
      
      // Restaurer tous les logos originaux
      document.querySelectorAll('.logo').forEach(logo => {
        logo.src = 'img/TTS_Logo.png';
      });
      
      // Cacher le message de complétion
      if (this.completionMessage) {
        this.completionMessage.style.display = 'none';
      }
      
      // Forcer la recalcul de la barre de progression fixe
      if (window.recalculateProgressBar) {
        window.recalculateProgressBar();
      }
    });
  },
  
  /**
   * Réinitialise la progression sauvegardée
   */
  resetProgress: function() {
    if (confirm(APP_CONFIG.messages.resetConfirm)) {
      localStorage.removeItem(APP_CONFIG.storageKey);
      this.savedProgress = {};
      
      // Réinitialiser l'état
      this.isComplete = false;
      
      // Si le mode doré était actif, le désactiver
      if (document.querySelector('.gameboy-container.golden-mode')) {
        this.deactivateGoldenMode();
      }
      
      // Arrêter les feux d'artifice
      EffectsManager.stopContinuousFireworks();
      
      // Réinitialiser l'interface
      this.initTasks();
      this.updateOverallProgress();
    }
  },
  
  /**
   * Supprime les tâches actuelles et retourne à l'accueil
   */
  returnToHome: function() {
    if (confirm(APP_CONFIG.messages.returnHomeConfirm)) {
      // Nettoyer tous les intervalles et timers
      if (this.saveDebounceTimer) {
        clearTimeout(this.saveDebounceTimer);
        this.saveDebounceTimer = null;
      }
      
      if (this.updateProgressDebounceTimer) {
        clearTimeout(this.updateProgressDebounceTimer);
        this.updateProgressDebounceTimer = null;
      }
      
      // Supprimer les tâches et la progression
      localStorage.removeItem(APP_CONFIG.storageKey);
      localStorage.removeItem('tontonAoTasks');
      localStorage.removeItem('tontonAoConfigData');
      localStorage.removeItem('tontonAoTasksData');
      
      // Réinitialiser les variables globales
      window.aoConfig = undefined;
      window.tasks = undefined;
      
      // Afficher l'écran d'accueil
      document.getElementById('checklist-screen').style.display = 'none';
      document.getElementById('welcome-screen').style.display = 'block';
      
      // Réinitialiser l'état
      this.savedProgress = {};
      this.isComplete = false;
      this.taskElements.clear();
      
      // Désactiver le mode doré s'il était actif
      this.deactivateGoldenMode();
      
      // Arrêter les feux d'artifice
      EffectsManager.stopContinuousFireworks();
      
      // Arrêter le compte à rebours
      if (CountdownManager && CountdownManager.interval) {
        clearInterval(CountdownManager.interval);
        CountdownManager.interval = null;
      }
      
      // S'assurer que les modes warning sont désactivés en une seule opération
      requestAnimationFrame(() => {
        document.body.classList.remove('warning-mode');
        document.querySelectorAll('.gameboy-container').forEach(container => {
          container.classList.remove('warning-mode');
        });
        document.querySelectorAll('.countdown-container, .countdown-message').forEach(element => {
          element.classList.remove('warning-mode');
          element.classList.remove('countdown-warning');
        });
      });
      
      // Arrêter le son d'avertissement s'il est en cours
      if (typeof SoundControl !== 'undefined') {
        SoundControl.stopWarningSound(false); // Arrêt immédiat (pas de fade out)
        SoundControl.hideSoundButton();
      } else {
        // Fallback si SoundControl n'est pas disponible
        const warningSound = document.getElementById('warning-sound');
        if (warningSound) {
          warningSound.pause();
          warningSound.currentTime = 0;
        }
      }
      
      // Réinitialiser le champ de fichier
      const fileInput = document.getElementById('tasks-file');
      if (fileInput) {
        fileInput.value = '';
      }
      const fileNameDisplay = document.getElementById('file-name');
      if (fileNameDisplay) {
        fileNameDisplay.textContent = 'Aucun fichier sélectionné';
      }
      
      // Effacer tout message d'erreur
      const errorMessage = document.getElementById('file-error-message');
      if (errorMessage) {
        errorMessage.textContent = '';
      }
    }
  }
};
/**
 * Gestion des tâches et de la progression
 */
const TasksManager = {
  // Éléments DOM fréquemment utilisés
  taskList: document.getElementById('task-list'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  progressWrapper: document.getElementById('progress-wrapper'),
  progressSpacer: document.getElementById('progress-spacer'),
  gameContainer: document.querySelector('.gameboy-container'),
  logoContainer: document.querySelector('.logo-container'),
  
  // État de l'application
  savedProgress: {},
  isComplete: false,
  
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
    
    // Note: La gestion de la barre de progression fixe est maintenant gérée par fix-progress-bar.js
  },
  
  /**
   * Charge la progression sauvegardée
   */
  loadProgress: function() {
    this.savedProgress = JSON.parse(localStorage.getItem(APP_CONFIG.storageKey)) || {};
  },
  
  /**
   * Sauvegarde la progression
   */
  saveProgress: function() {
    localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(this.savedProgress));
  },
  
  /**
   * Ancienne méthode pour gérer la barre de progression fixe
   * Désactivée car cette fonctionnalité est maintenant gérée par fix-progress-bar.js
   */
  handleProgressBarScroll: function() {
    // Méthode désactivée - voir fix-progress-bar.js pour l'implémentation actuelle
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
    
    this.taskList.innerHTML = '';
    
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
        <span class="task-progress">0/${subtaskCount}</span>
      `;
      
      // Ajouter le tag DONE! s'il est complété
      if (isCompleted) {
        const doneTag = document.createElement('span');
        doneTag.className = 'task-done-tag';
        doneTag.textContent = 'DONE!';
        taskHeader.appendChild(doneTag);
      }
      
      // Gestionnaire d'événement pour l'accordéon
      taskHeader.addEventListener('click', (e) => {
        // Ne pas déclencher l'accordéon si on clique sur la checkbox principale
        if (e.target.classList.contains('task-main-checkbox')) {
          return;
        }
        // Permettre de déplier même si complété
        taskElement.classList.toggle('open');
      });
      
      // Gestionnaire d'événement pour la checkbox principale
      const mainCheckbox = taskHeader.querySelector('.task-main-checkbox');
      mainCheckbox.addEventListener('change', function(e) {
        // Empêcher la propagation pour éviter le déclenchement de l'accordéon
        e.stopPropagation();
        
        const isChecked = this.checked;
        const checkboxes = taskElement.querySelectorAll('.subtask-checkbox');
        
        // Cocher/décocher toutes les sous-tâches
        checkboxes.forEach(checkbox => {
          // Seulement changer l'état si nécessaire pour éviter des événements inutiles
          if (checkbox.checked !== isChecked) {
            checkbox.checked = isChecked;
            
            // Déclencher manuellement l'événement change
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
          }
        });
      });
      
      // Création du contenu de la tâche
      const taskContent = document.createElement('div');
      taskContent.className = 'task-content';
      
      // Liste des sous-tâches
      const subtasksList = document.createElement('ul');
      subtasksList.className = 'subtasks';
      
      // Création des sous-tâches
      task.subtasks.forEach((subtask, subtaskIndex) => {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = 'subtask';
        
        const isChecked = savedSubtasks.includes(subtaskIndex);
        if (isChecked) completedCount++;
        
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
        
        // Gestionnaire d'événement pour cliquer sur toute la ligne
        subtaskItem.addEventListener('click', function(e) {
          // Ne pas déclencher le changement si on clique sur le bouton de copie
          if (e.target.classList.contains('subtask-copy-btn') || e.target.closest('.subtask-copy-btn')) {
            return;
          }
          
          // Éviter de déclencher si on clique déjà sur la checkbox
          if (e.target.type !== 'checkbox') {
            const checkbox = this.querySelector('.subtask-checkbox');
            checkbox.checked = !checkbox.checked;
            
            // Déclencher manuellement l'événement change
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
          }
        });
        
        // Ajouter le gestionnaire d'événement pour le bouton de copie
        const copyBtn = subtaskItem.querySelector('.subtask-copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const filename = this.dataset.filename;
            Utils.copyToClipboard(filename);
          });
        }
        
        // Ajouter une classe pour les tâches cochées (pour les navigateurs qui ne supportent pas :has)
        const checkbox = subtaskItem.querySelector('.subtask-checkbox');
        if (checkbox.checked) {
          subtaskItem.classList.add('checked-subtask');
        }
        
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            subtaskItem.classList.add('checked-subtask');
          } else {
            subtaskItem.classList.remove('checked-subtask');
          }
        });
        
        subtasksList.appendChild(subtaskItem);
      });
      
      // Mise à jour du compteur
      taskHeader.querySelector('.task-progress').textContent = `${completedCount}/${subtaskCount}`;
      
      // Vérifier si le livrable a des sous-tâches qui sont des fichiers
      const hasSubtaskFiles = task.subtasks.some(subtask => 
        typeof subtask === 'object' && subtask.filename
      );
      
      // Footer pour les informations sur les fichiers
      const taskFooter = document.createElement('div');
      taskFooter.className = 'task-footer';
      
      // Logique de contenu du footer selon le type de livrable (multi-fichiers ou fichier global)
      // 1. Si le livrable est explicitement marqué comme multi-fichiers (isMultiFile: true) -> message d'information
      // 2. Si le livrable a des sous-tâches avec des fichiers -> message d'information
      // 3. Si le livrable a un nom de fichier global -> afficher ce nom de fichier avec un bouton copier
      // 4. Sinon -> message "Aucun fichier associé"
      
      // Vérifier si le livrable est explicitement marqué comme multi-fichiers
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
      
      // Ajout des éléments au DOM
      taskContent.appendChild(subtasksList);
      taskElement.appendChild(taskHeader);
      taskElement.appendChild(taskContent);
      taskElement.appendChild(taskFooter);
      this.taskList.appendChild(taskElement);
      
      // Gestionnaires d'événements pour les cases à cocher
      const checkboxes = subtasksList.querySelectorAll('.subtask-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', this.handleSubtaskChange.bind(this));
      });
      
      // Gestionnaire d'événement pour le bouton de copie s'il existe
      const copyBtn = taskFooter.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const filename = e.target.dataset.filename;
          Utils.copyToClipboard(filename);
        });
      }
    });
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
    } else {
      // Supprimer la sous-tâche des complétées
      this.savedProgress[taskIndex] = this.savedProgress[taskIndex].filter(index => index !== subtaskIndex);
      
      // Jouer le son de uncheck
      EffectsManager.playUncheckSound();
      
      // Si le livrable était complété, ouvrir l'accordéon après avoir décoché
      const savedSubtasks = this.savedProgress[taskIndex] || [];
      const subtaskCount = tasks[taskIndex].subtasks.length;
      if (savedSubtasks.length + 1 === subtaskCount) {
        // La tâche vient de passer de complétée à non-complétée
        taskElement.classList.add('open');
      }
    }
    
    this.saveProgress();
    
    // Mise à jour du compteur de progression
    this.updateTaskProgress(taskElement, taskIndex);
    
    // Mise à jour de la progression globale
    this.updateOverallProgress();
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
    progressElement.textContent = `${completedCount}/${subtaskCount}`;
    
    // Mise à jour de la checkbox principale
    const mainCheckbox = taskElement.querySelector('.task-main-checkbox');
    mainCheckbox.checked = (completedCount === subtaskCount && subtaskCount > 0);
    
    // Sauvegarde de la progression dans localStorage
    this.saveProgress();
    
    // Vérification si la tâche est complète
    if (completedCount === subtaskCount) {
      if (!taskElement.classList.contains('completed')) {
        // Marquer comme complété et fermer l'accordéon
        taskElement.classList.add('completed');
        taskElement.classList.remove('open');
        
        // Ajouter le tag "DONE!"
        const taskHeader = taskElement.querySelector('.task-header');
        if (!taskHeader.querySelector('.task-done-tag')) {
          const doneTag = document.createElement('span');
          doneTag.className = 'task-done-tag';
          doneTag.textContent = 'DONE!';
          taskHeader.appendChild(doneTag);
        }
        
        // Attendre que l'accordéon soit fermé avant de lancer les effets
        setTimeout(() => {
          // Flash blanc d'abord
          EffectsManager.createFlash();
          
          // Animation et effets
          EffectsManager.createParticleEffect(taskElement);
          EffectsManager.playSuccessSound();
          taskElement.classList.add('complete-animation');
          
          setTimeout(() => {
            taskElement.classList.remove('complete-animation');
          }, 500);
        }, 300); // Délai pour l'animation de fermeture de l'accordéon
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
    
    // Mettre à jour l'interface
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
        if (CountdownManager.warningActive && typeof SoundControl !== 'undefined') {
          SoundControl.stopWarningSound(true); // Fade out pendant 1 seconde
        }
        
        // Activer le mode doré (qui fera défiler vers le haut)
        this.activateGoldenMode();
        
        // Effet de flash (après le défilement)
        setTimeout(() => {
          EffectsManager.createFlash();
          
          // Jouer le son de fin
          EffectsManager.playFinishSound();
          
          // Lancer les feux d'artifice continus
          EffectsManager.startContinuousFireworks();
          
          // Créer un effet de particules supplémentaire pour 100%
          setTimeout(() => {
            EffectsManager.createParticleEffect(document.querySelector('header'));
          }, 300);
        }, 600); // Délai légèrement plus long que celui du défilement
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
  },
  
  /**
   * Active le mode doré (quand tout est complété)
   */
  activateGoldenMode: function() {
    // Assurer que l'écran défile en douceur vers le haut en premier
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Attendre que le défilement soit terminé avant d'activer le mode doré
    // Délai plus long pour s'assurer que l'animation de défilement est terminée
    setTimeout(() => {
      // Changer le logo
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.src = 'img/TTS_Logo_Checked.png';
      }
      
      // Activer le mode doré
      this.gameContainer.classList.add('golden-mode');
      
      // Assurer que le message de complétion est visible
      const completionMessage = document.getElementById('completion-message');
      if (completionMessage) {
        completionMessage.style.display = 'block';
      }
    }, 800); // Délai augmenté pour permettre au défilement de se terminer complètement
  },
  
  /**
   * Désactive le mode doré
   */
  deactivateGoldenMode: function() {
    this.gameContainer.classList.remove('golden-mode');
    
    // Restaurer le logo original
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.src = 'img/TTS_Logo.png';
    }
    
    // Cacher le message de complétion
    const completionMessage = document.getElementById('completion-message');
    if (completionMessage) {
      completionMessage.style.display = 'none';
    }
  },
  
  /**
   * Réinitialise la progression sauvegardée
   */
  resetProgress: function() {
    if (confirm(APP_CONFIG.messages.resetConfirm)) {
      localStorage.removeItem(APP_CONFIG.storageKey);
      this.savedProgress = {};
      this.initTasks();
      this.updateOverallProgress();
    }
  },
  
  /**
   * Supprime les tâches actuelles et retourne à l'accueil
   */
  returnToHome: function() {
    if (confirm(APP_CONFIG.messages.returnHomeConfirm)) {
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
      
      // Désactiver le mode doré s'il était actif
      this.deactivateGoldenMode();
      
      // Arrêter les feux d'artifice
      EffectsManager.stopContinuousFireworks();
      
      // Arrêter le compte à rebours et désactiver le mode warning
      if (CountdownManager.interval) {
        clearInterval(CountdownManager.interval);
        CountdownManager.interval = null;
      }
      
      // S'assurer que les modes warning sont désactivés
      document.body.classList.remove('warning-mode');
      document.querySelectorAll('.gameboy-container').forEach(container => {
        container.classList.remove('warning-mode');
      });
      document.querySelectorAll('.countdown-container, .countdown-message').forEach(element => {
        element.classList.remove('warning-mode');
        element.classList.remove('countdown-warning');
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
      const loadBtn = document.getElementById('load-tasks-btn');
      if (loadBtn) {
        loadBtn.disabled = true;
        loadBtn.dataset.fileContent = ''; // Vider le contenu du fichier temporaire
      }
      // Effacer tout message d'erreur
      const errorMessage = document.getElementById('file-error-message');
      if (errorMessage) {
        errorMessage.textContent = '';
      }
    }
  }
};

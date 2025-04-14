document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM fréquemment utilisés
  const taskList = document.getElementById('task-list');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const resetBtn = document.getElementById('reset-btn');
  const successSound = document.getElementById('success-sound');
  const checkSound = document.getElementById('check-sound');
  const uncheckSound = document.getElementById('uncheck-sound');
  const finishSound = document.getElementById('finish-sound');
  const particlesContainer = document.getElementById('particles-container');
  const fireworksContainer = document.getElementById('fireworks-container');
  const flashOverlay = document.getElementById('flash-overlay');
  const gameContainer = document.querySelector('.gameboy-container');
  
  // Variables pour les feux d'artifice
  let fireworksInterval;
  let isComplete = false;
  
  // Chargement des données sauvegardées
  let savedProgress = JSON.parse(localStorage.getItem('tontonAoProgress')) || {};
  
  // Initialisation de l'application
  initTasks();
  updateOverallProgress();
  
  // Gestionnaire d'événements pour le bouton de réinitialisation
  resetBtn.addEventListener('click', resetProgress);
  
  /**
   * Initialise la liste des tâches à partir du fichier tasks.js
   */
  function initTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, taskIndex) => {
      // Création du conteneur de tâche
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      taskElement.dataset.index = taskIndex;
      
      // Calcul du progrès pour cette tâche
      const subtaskCount = task.subtasks.length;
      let completedCount = 0;
      
      // Vérification des sous-tâches complétées
      const savedSubtasks = savedProgress[taskIndex] || [];
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
            copyToClipboard(filename);
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
      
      // Deux cas de figure possibles:
      // 1. Les sous-tâches ont des fichiers individuels -> afficher un message d'information
      // 2. Le livrable a un nom de fichier global -> afficher le nom de fichier et un bouton pour le copier
      
      if (task.filename) {
        // Si le livrable a un nom de fichier global, toujours l'afficher
        let footerContent = `
          <div class="filename-display">${task.filename}</div>
          <button class="copy-btn" data-filename="${task.filename}">📋 Copier</button>
        `;
        
        // Si en plus il y a des sous-tâches avec des fichiers, ajouter un message d'information
        if (hasSubtaskFiles) {
          footerContent += `
            <div class="info-message-container">
              <div class="info-message">Les fichiers individuels sont aussi accessibles depuis chaque sous-tâche</div>
            </div>
          `;
        }
        
        taskFooter.innerHTML = footerContent;
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
      taskList.appendChild(taskElement);
      
      // Gestionnaires d'événements pour les cases à cocher
      const checkboxes = subtasksList.querySelectorAll('.subtask-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleSubtaskChange);
      });
      
      // Gestionnaire d'événement pour le bouton de copie
      const copyBtn = taskFooter.querySelector('.copy-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const filename = e.target.dataset.filename;
        copyToClipboard(filename);
      });
    });
  }
  
  /**
   * Gère le changement d'état d'une sous-tâche
   */
  function handleSubtaskChange(e) {
    const checkbox = e.target;
    const taskIndex = parseInt(checkbox.dataset.task);
    const subtaskIndex = parseInt(checkbox.dataset.subtask);
    const taskElement = checkbox.closest('.task-item');
    
    // Mise à jour du localStorage
    if (!savedProgress[taskIndex]) {
      savedProgress[taskIndex] = [];
    }
    
    if (checkbox.checked) {
      // Ajouter la sous-tâche aux complétées
      if (!savedProgress[taskIndex].includes(subtaskIndex)) {
        savedProgress[taskIndex].push(subtaskIndex);
      }
      
      // Jouer le son de check
      playCheckSound();
    } else {
      // Supprimer la sous-tâche des complétées
      savedProgress[taskIndex] = savedProgress[taskIndex].filter(index => index !== subtaskIndex);
      
      // Jouer le son de uncheck
      playUncheckSound();
      
      // Si le livrable était complété, ouvrir l'accordéon après avoir décoché
      const savedSubtasks = savedProgress[taskIndex] || [];
      const subtaskCount = tasks[taskIndex].subtasks.length;
      if (savedSubtasks.length + 1 === subtaskCount) {
        // La tâche vient de passer de complétée à non-complétée
        taskElement.classList.add('open');
      }
    }
    
    localStorage.setItem('tontonAoProgress', JSON.stringify(savedProgress));
    
    // Mise à jour du compteur de progression
    updateTaskProgress(taskElement, taskIndex);
    
    // Mise à jour de la progression globale
    updateOverallProgress();
  }
  
  /**
   * Joue le son de check
   */
  function playCheckSound() {
    checkSound.currentTime = 0;
    checkSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de check:', e);
    });
  }
  
  /**
   * Joue le son de uncheck
   */
  function playUncheckSound() {
    uncheckSound.currentTime = 0;
    uncheckSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de uncheck:', e);
    });
  }
  
  /**
   * Vérifie si une sous-tâche a un nom de fichier
   */
  function subtaskHasFilename(taskIndex, subtaskIndex) {
    const task = tasks[taskIndex];
    const subtask = task.subtasks[subtaskIndex];
    return typeof subtask === 'object' && subtask.filename;
  }
  
  /**
   * Récupère le label d'une sous-tâche
   */
  function getSubtaskLabel(taskIndex, subtaskIndex) {
    const task = tasks[taskIndex];
    const subtask = task.subtasks[subtaskIndex];
    return typeof subtask === 'object' ? subtask.label : subtask;
  }
  
  /**
   * Joue le son de fin (quand tout est complété)
   */
  function playFinishSound() {
    finishSound.currentTime = 0;
    finishSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de fin:', e);
    });
  }
  
  /**
   * Crée un flash blanc sur tout l'écran
   */
  function createFlash() {
    flashOverlay.classList.add('flash');
    
    // Retirer la classe après l'animation
    setTimeout(() => {
      flashOverlay.classList.remove('flash');
    }, 200);
  }
  
  /**
   * Active le mode doré (quand tout est complété)
   */
  function activateGoldenMode() {
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
      gameContainer.classList.add('golden-mode');
      
      // Assurer que le message de complétion est visible
      const completionMessage = document.getElementById('completion-message');
      if (completionMessage) {
        completionMessage.style.display = 'block';
      }
    }, 800); // Délai augmenté pour permettre au défilement de se terminer complètement
  }
  
  /**
   * Désactive le mode doré
   */
  function deactivateGoldenMode() {
    gameContainer.classList.remove('golden-mode');
    
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
  }
  
  /**
   * Crée un effet de feu d'artifice
   */
  function createFirework() {
    // Créer plusieurs particules qui partent d'un point central
    const positions = [
      { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
    ];
    
    positions.forEach(position => {
      // Point central
      const firework = document.createElement('div');
      firework.className = 'firework';
      
      // Couleurs variées pour les feux d'artifice
      const colors = ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FF8C00', '#DAA520'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      firework.style.backgroundColor = randomColor;
      firework.style.boxShadow = `0 0 8px 2px ${randomColor}80`;
      
      // Position aléatoire
      firework.style.left = `${position.x}px`;
      firework.style.top = `${position.y}px`;
      
      fireworksContainer.appendChild(firework);
      
      // Supprimer après l'animation
      setTimeout(() => {
        firework.remove();
      }, 1000);
      
      // Créer des éclats autour du feu d'artifice
      createFireworkSparks(position.x, position.y, randomColor);
    });
  }
  
  /**
   * Crée des éclats autour du feu d'artifice
   */
  function createFireworkSparks(x, y, color) {
    const sparkCount = 8 + Math.floor(Math.random() * 8); // 8-15 éclats
    
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'particle';
      spark.style.backgroundColor = color;
      
      // Position initiale
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      
      // Direction aléatoire
      const angle = (i / sparkCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const duration = 500 + Math.random() * 500;
      
      spark.style.opacity = '1';
      fireworksContainer.appendChild(spark);
      
      // Animation
      const startTime = performance.now();
      
      function animateSpark(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentX = x + Math.cos(angle) * distance * progress;
        const currentY = y + Math.sin(angle) * distance * progress;
        
        spark.style.left = `${currentX}px`;
        spark.style.top = `${currentY}px`;
        spark.style.opacity = 1 - progress;
        
        if (progress < 1) {
          requestAnimationFrame(animateSpark);
        } else {
          spark.remove();
        }
      }
      
      requestAnimationFrame(animateSpark);
    }
  }
  
  /**
   * Démarre les feux d'artifice continus
   */
  function startContinuousFireworks() {
    // Nettoyer tout intervalle existant
    if (fireworksInterval) {
      clearInterval(fireworksInterval);
    }
    
    // Créer immédiatement un premier feu d'artifice
    createFirework();
    
    // Puis continuer à intervalles réguliers
    fireworksInterval = setInterval(() => {
      createFirework();
    }, 1500); // Toutes les 1.5 secondes
  }
  
  /**
   * Arrête les feux d'artifice continus
   */
  function stopContinuousFireworks() {
    if (fireworksInterval) {
      clearInterval(fireworksInterval);
      fireworksInterval = null;
    }
    
    // Nettoyer tous les feux d'artifice restants
    fireworksContainer.innerHTML = '';
  }
  
  /**
   * Met à jour la progression d'une tâche spécifique
   */
  function updateTaskProgress(taskElement, taskIndex) {
    const task = tasks[taskIndex];
    const subtaskCount = task.subtasks.length;
    const completedSubtasks = savedProgress[taskIndex] || [];
    const completedCount = completedSubtasks.length;
    
    // Mise à jour du compteur
    const progressElement = taskElement.querySelector('.task-progress');
    progressElement.textContent = `${completedCount}/${subtaskCount}`;
    
    // Mise à jour de la checkbox principale
    const mainCheckbox = taskElement.querySelector('.task-main-checkbox');
    mainCheckbox.checked = (completedCount === subtaskCount && subtaskCount > 0);
    
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
          createFlash();
          
          // Animation et effets
          createParticleEffect(taskElement);
          playSuccessSound();
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
  }
  
  /**
   * Met à jour la barre de progression globale
   */
  function updateOverallProgress() {
    const totalSubtasks = tasks.reduce((sum, task) => sum + task.subtasks.length, 0);
    let completedTotal = 0;
    
    // Compter toutes les sous-tâches complétées
    Object.values(savedProgress).forEach(subtasks => {
      completedTotal += subtasks.length;
    });
    
    // Calculer le pourcentage
    const progressPercentage = totalSubtasks > 0 
      ? Math.round((completedTotal / totalSubtasks) * 100) 
      : 0;
    
    // Mettre à jour l'interface
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${progressPercentage}%`;
    
    // Vérifier si tout est complété (100%)
    if (progressPercentage === 100) {
      // Ajouter la classe 'completed' pour le style doré pour la barre
      progressFill.classList.add('completed');
      
      // Si c'est la première fois qu'on atteint 100%
      if (!isComplete) {
        isComplete = true;
        
        // Activer le mode doré (qui fera défiler vers le haut)
        activateGoldenMode();
        
        // Effet de flash (après le défilement)
        setTimeout(() => {
          createFlash();
          
          // Jouer le son de fin
          playFinishSound();
          
          // Lancer les feux d'artifice continus
          startContinuousFireworks();
          
          // Créer un effet de particules supplémentaire pour 100%
          setTimeout(() => {
            createParticleEffect(document.querySelector('header'));
          }, 300);
        }, 600); // Délai légèrement plus long que celui du défilement
      }
    } else {
      // Si on était à 100% mais qu'on a décoché une tâche
      if (isComplete) {
        isComplete = false;
        
        // Désactiver le mode doré
        deactivateGoldenMode();
        
        // Arrêter les feux d'artifice
        stopContinuousFireworks();
      }
      
      progressFill.classList.remove('completed');
    }
  }
  
  /**
   * Crée un effet de particules lors de la complétion d'une tâche
   */
  function createParticleEffect(taskElement) {
    const rect = taskElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Création des particules
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      
      // Types de particules variés pour un effet plus festif
      const particleTypes = ['gold', 'white', 'blue', 'red', 'green'];
      const randomType = Math.random();
      
      if (randomType < 0.2) {
        particle.className = 'particle star';
      } else {
        const typeIndex = Math.floor(Math.random() * particleTypes.length);
        particle.className = `particle ${particleTypes[typeIndex]}`;
      }
      
      // Position initiale
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 50;
      const startX = centerX;
      const startY = centerY;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      // Animation
      const animationDuration = Math.random() * 1500 + 800;
      particle.style.animation = `particleFade ${animationDuration}ms forwards`;
      
      // Trajectoire avec gravité pour un effet plus naturel
      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance + 40; // légère gravité
      
      particlesContainer.appendChild(particle);
      
      // Animation avec requestAnimationFrame pour de meilleures performances
      const startTime = performance.now();
      
      function animateParticle(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Trajectoire avec une légère parabole
        const easeOutCubic = function(t) { return 1 - Math.pow(1 - t, 3); };
        const easedProgress = easeOutCubic(progress);
        
        const currentX = startX + (endX - startX) * easedProgress;
        const currentY = startY + (endY - startY) * easedProgress + 
                         (Math.sin(progress * Math.PI) * -20); // légère parabole
        
        particle.style.left = `${currentX}px`;
        particle.style.top = `${currentY}px`;
        
        // Échelle décroissante en fin d'animation
        if (progress > 0.7) {
          const scaleDown = 1 - ((progress - 0.7) / 0.3);
          particle.style.transform = `scale(${scaleDown})`;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      }
      
      requestAnimationFrame(animateParticle);
    }
  }
  
  /**
   * Joue le son de succès
   */
  function playSuccessSound() {
    successSound.currentTime = 0;
    successSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son:', e);
    });
  }
  
  /**
   * Copie un texte dans le presse-papier
   */
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Feedback visuel
      const copyBtns = document.querySelectorAll('.copy-btn');
      copyBtns.forEach(btn => {
        if (btn.dataset.filename === text) {
          const originalText = btn.textContent;
          
          // Stocker la largeur actuelle du bouton pour la préserver
          const currentWidth = btn.offsetWidth;
          const currentHeight = btn.offsetHeight;
          
          // Appliquer une largeur fixe temporaire pour éviter le redimensionnement
          if (!btn.dataset.originalWidth) {
            btn.dataset.originalWidth = `${currentWidth}px`;
            btn.dataset.originalHeight = `${currentHeight}px`;
          }
          
          btn.textContent = 'Copié !';
          
          setTimeout(() => {
            btn.textContent = originalText;
            
            // Retirer la largeur fixe après que le texte soit revenu à l'original
            setTimeout(() => {
              if (btn.dataset.originalWidth) {
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
  }
  
  /**
   * Réinitialise la progression sauvegardée
   */
  function resetProgress() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute la progression ?')) {
      localStorage.removeItem('tontonAoProgress');
      savedProgress = {};
      initTasks();
      updateOverallProgress();
    }
  }
});

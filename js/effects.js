/**
 * Gestion des effets visuels et sonores
 */
const EffectsManager = {
  // Sons
  successSound: document.getElementById('success-sound'),
  checkSound: document.getElementById('check-sound'),
  uncheckSound: document.getElementById('uncheck-sound'),
  finishSound: document.getElementById('finish-sound'),
  
  // Conteneurs pour les effets visuels
  particlesContainer: document.getElementById('particles-container'),
  fireworksContainer: document.getElementById('fireworks-container'),
  flashOverlay: document.getElementById('flash-overlay'),
  
  // Variables d'état
  fireworksInterval: null,
  
  /**
   * Joue le son de check
   */
  playCheckSound: function() {
    if (!this.checkSound) return;
    
    this.checkSound.currentTime = 0;
    this.checkSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de check:', e);
    });
  },
  
  /**
   * Joue le son de uncheck
   */
  playUncheckSound: function() {
    if (!this.uncheckSound) return;
    
    this.uncheckSound.currentTime = 0;
    this.uncheckSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de uncheck:', e);
    });
  },
  
  /**
   * Joue le son de succès
   */
  playSuccessSound: function() {
    if (!this.successSound) return;
    
    this.successSound.currentTime = 0;
    this.successSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de succès:', e);
    });
  },
  
  /**
   * Joue le son de fin (quand tout est complété)
   */
  playFinishSound: function() {
    if (!this.finishSound) return;
    
    this.finishSound.currentTime = 0;
    this.finishSound.play().catch(e => {
      console.log('Erreur lors de la lecture du son de fin:', e);
    });
  },
  
  /**
   * Crée un flash blanc sur tout l'écran
   */
  createFlash: function() {
    this.flashOverlay.classList.add('flash');
    
    // Retirer la classe après l'animation
    setTimeout(() => {
      this.flashOverlay.classList.remove('flash');
    }, 200);
  },
  
  /**
   * Crée un effet de particules lors de la complétion d'une tâche
   * @param {HTMLElement} taskElement - Élément de tâche
   */
  createParticleEffect: function(taskElement) {
    const rect = taskElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Création des particules
    for (let i = 0; i < APP_CONFIG.effects.particleCount; i++) {
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
      
      this.particlesContainer.appendChild(particle);
      
      // Animation avec requestAnimationFrame pour de meilleures performances
      const startTime = performance.now();
      
      const animateParticle = (currentTime) => {
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
      };
      
      requestAnimationFrame(animateParticle);
    }
  },
  
  /**
   * Crée un effet de feu d'artifice
   */
  createFirework: function() {
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
      
      this.fireworksContainer.appendChild(firework);
      
      // Supprimer après l'animation
      setTimeout(() => {
        firework.remove();
      }, 1000);
      
      // Créer des éclats autour du feu d'artifice
      this.createFireworkSparks(position.x, position.y, randomColor);
    });
  },
  
  /**
   * Crée des éclats autour du feu d'artifice
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {string} color - Couleur des éclats
   */
  createFireworkSparks: function(x, y, color) {
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
      this.fireworksContainer.appendChild(spark);
      
      // Animation
      const startTime = performance.now();
      
      const animateSpark = (currentTime) => {
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
      };
      
      requestAnimationFrame(animateSpark);
    }
  },
  
  /**
   * Démarre les feux d'artifice continus
   */
  startContinuousFireworks: function() {
    // Nettoyer tout intervalle existant
    if (this.fireworksInterval) {
      clearInterval(this.fireworksInterval);
    }
    
    // Créer immédiatement un premier feu d'artifice
    this.createFirework();
    
    // Puis continuer à intervalles réguliers
    this.fireworksInterval = setInterval(() => {
      this.createFirework();
    }, APP_CONFIG.effects.fireworkInterval); // Toutes les 1.5 secondes
  },
  
  /**
   * Arrête les feux d'artifice continus
   */
  stopContinuousFireworks: function() {
    if (this.fireworksInterval) {
      clearInterval(this.fireworksInterval);
      this.fireworksInterval = null;
    }
    
    // Nettoyer tous les feux d'artifice restants
    this.fireworksContainer.innerHTML = '';
  }
};

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
  activeFireworks: 0,
  particlePool: [], // Pool de particules pour la réutilisation
  
  /**
   * Initialise le pool de particules
   */
  initParticlePool: function() {
    // Précréer un pool de particules pour éviter la création/destruction constante d'éléments DOM
    for (let i = 0; i < APP_CONFIG.effects.particleCount * 2; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.display = 'none';
      this.particlesContainer.appendChild(particle);
      this.particlePool.push(particle);
    }
  },
  
  /**
   * Obtient une particule du pool ou en crée une nouvelle si nécessaire
   * @return {HTMLElement} - Élément de particule
   */
  getParticleFromPool: function() {
    // Réutiliser une particule existante si disponible
    for (let i = 0; i < this.particlePool.length; i++) {
      const particle = this.particlePool[i];
      if (particle.style.display === 'none') {
        particle.style.display = 'block';
        return particle;
      }
    }
    
    // Si aucune particule n'est disponible, créer une nouvelle (cas rare)
    const particle = document.createElement('div');
    particle.className = 'particle';
    this.particlesContainer.appendChild(particle);
    this.particlePool.push(particle);
    return particle;
  },
  
  /**
   * Retourne une particule au pool
   * @param {HTMLElement} particle - Élément de particule
   */
  returnParticleToPool: function(particle) {
    particle.style.display = 'none';
    particle.style.transform = '';
    particle.style.opacity = '1';
    particle.className = 'particle'; // Réinitialiser la classe
  },
  
  /**
   * Joue le son de check
   */
  playCheckSound: function() {
    if (!this.checkSound) return;
    
    this.checkSound.currentTime = 0;
    this.checkSound.play().catch(e => {
      if (APP_CONFIG.debug) {
        console.log('Erreur lors de la lecture du son de check:', e);
      }
    });
  },
  
  /**
   * Joue le son de uncheck
   */
  playUncheckSound: function() {
    if (!this.uncheckSound) return;
    
    this.uncheckSound.currentTime = 0;
    this.uncheckSound.play().catch(e => {
      if (APP_CONFIG.debug) {
        console.log('Erreur lors de la lecture du son de uncheck:', e);
      }
    });
  },
  
  /**
   * Joue le son de succès
   */
  playSuccessSound: function() {
    if (!this.successSound) return;
    
    this.successSound.currentTime = 0;
    this.successSound.play().catch(e => {
      if (APP_CONFIG.debug) {
        console.log('Erreur lors de la lecture du son de succès:', e);
      }
    });
  },
  
  /**
   * Joue le son de fin (quand tout est complété)
   */
  playFinishSound: function() {
    if (!this.finishSound) return;
    
    this.finishSound.currentTime = 0;
    this.finishSound.play().catch(e => {
      if (APP_CONFIG.debug) {
        console.log('Erreur lors de la lecture du son de fin:', e);
      }
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
    // Initialiser le pool de particules si ce n'est pas déjà fait
    if (this.particlePool.length === 0) {
      this.initParticlePool();
    }
    
    const rect = taskElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Création des particules
    for (let i = 0; i < APP_CONFIG.effects.particleCount; i++) {
      const particle = this.getParticleFromPool();
      
      // Types de particules variés pour un effet plus festif
      const particleTypes = ['gold', 'white', 'blue', 'red', 'green'];
      const randomType = Math.random();
      
      if (randomType < 0.2) {
        particle.className = 'particle star';
      } else {
        const typeIndex = Math.floor(Math.random() * particleTypes.length);
        particle.className = `particle ${particleTypes[typeIndex]}`;
      }
      
      // Position initiale (au centre de l'élément)
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      
      // Préparer les propriétés d'animation
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 50;
      const animationDuration = Math.random() * 1000 + 600; // Réduit de 800-1500ms à 600-1000ms
      
      // Utiliser une seule animation requestAnimationFrame pour toutes les particules
      const startTime = performance.now();
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance + 40; // légère gravité
      
      const animateParticle = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        if (progress < 1) {
          // Utiliser transform au lieu de left/top pour de meilleures performances
          const easeOutCubic = function(t) { return 1 - Math.pow(1 - t, 3); };
          const easedProgress = easeOutCubic(progress);
          
          const translateX = (endX - centerX) * easedProgress;
          const translateY = (endY - centerY) * easedProgress + (Math.sin(progress * Math.PI) * -20);
          
          // Utiliser transform et opacity pour de meilleures performances
          particle.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1})`;
          particle.style.opacity = 1 - progress;
          
          requestAnimationFrame(animateParticle);
        } else {
          // Animation terminée, retourner la particule au pool
          this.returnParticleToPool(particle);
        }
      };
      
      requestAnimationFrame(animateParticle);
    }
  },
  
  /**
   * Crée un effet de feu d'artifice
   */
  createFirework: function() {
    // Limiter le nombre de feux d'artifice actifs
    if (this.activeFireworks >= APP_CONFIG.effects.maxFireworks) {
      return;
    }
    
    this.activeFireworks++;
    
    // Créer un seul feu d'artifice à la fois au lieu de plusieurs
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.7); // Limiter à 70% de la hauteur
    
    // Couleurs pour les feux d'artifice
    const colors = ['#FFD700', '#FFA500', '#FF4500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Créer le feu d'artifice central
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.backgroundColor = randomColor;
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    this.fireworksContainer.appendChild(firework);
    
    // Créer les étincelles avec un fragment de document pour éviter les reflows multiples
    const fragment = document.createDocumentFragment();
    const sparkCount = 6 + Math.floor(Math.random() * 4); // Réduit de 8-15 à 6-9
    const sparks = [];
    
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'particle';
      spark.style.backgroundColor = randomColor;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      fragment.appendChild(spark);
      sparks.push(spark);
    }
    
    this.fireworksContainer.appendChild(fragment);
    
    // Animation des étincelles
    const startTime = performance.now();
    const duration = 500 + Math.random() * 300; // Réduit de 500-1000ms à 500-800ms
    
    const animateFirework = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        // Animer les étincelles avec transform pour de meilleures performances
        sparks.forEach((spark, i) => {
          const angle = (i / sparkCount) * Math.PI * 2;
          const distance = 50 + Math.random() * 30; // Réduit de 50-100 à 50-80
          
          const translateX = Math.cos(angle) * distance * progress;
          const translateY = Math.sin(angle) * distance * progress;
          
          spark.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
          spark.style.opacity = 1 - progress;
        });
        
        requestAnimationFrame(animateFirework);
      } else {
        // Nettoyer les éléments
        firework.remove();
        sparks.forEach(spark => spark.remove());
        
        // Décrémenter le compteur de feux d'artifice actifs
        this.activeFireworks--;
      }
    };
    
    requestAnimationFrame(animateFirework);
    
    // Nettoyer le feu d'artifice central après son animation
    setTimeout(() => {
      if (firework.parentNode) {
        firework.remove();
      }
    }, 1000);
  },
  
  /**
   * Démarre les feux d'artifice continus
   */
  startContinuousFireworks: function() {
    // Nettoyer tout intervalle existant
    if (this.fireworksInterval) {
      clearInterval(this.fireworksInterval);
    }
    
    // Initialiser le pool de particules si ce n'est pas déjà fait
    if (this.particlePool.length === 0) {
      this.initParticlePool();
    }
    
    // Réinitialiser le compteur
    this.activeFireworks = 0;
    
    // Créer immédiatement un premier feu d'artifice
    this.createFirework();
    
    // Puis continuer à intervalles réguliers avec un intervalle plus long
    this.fireworksInterval = setInterval(() => {
      this.createFirework();
    }, APP_CONFIG.effects.fireworkInterval);
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
    this.activeFireworks = 0;
  }
};

// Initialiser le pool de particules au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation différée pour ne pas bloquer le chargement initial
  setTimeout(() => {
    EffectsManager.initParticlePool();
  }, 1000);
});
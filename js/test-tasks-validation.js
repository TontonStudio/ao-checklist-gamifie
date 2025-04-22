/**
 * Script de test pour la validation et le chargement des fichiers tasks.js
 * Ce script tente de valider et charger les fichiers de tâches directement depuis l'application
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("----- DÉBUT DU TEST DE VALIDATION DES TÂCHES -----");
  
  // Référence aux fichiers tasks.js connus
  const knownTaskFiles = [
    'tasks.js',
    'bordeaux_tasks.js'
  ];
  
  // Tester chaque fichier connu
  knownTaskFiles.forEach(filename => {
    console.log(`Tentative de chargement du fichier: ${filename}`);
    
    fetch(filename)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Impossible de charger ${filename} (${response.status})`);
        }
        return response.text();
      })
      .then(content => {
        console.log(`Fichier ${filename} chargé, taille: ${content.length} caractères`);
        
        // Tester la validation
        const isValid = Utils.validateTasksFile(content);
        console.log(`Validation de ${filename}: ${isValid ? 'RÉUSSIE ✓' : 'ÉCHOUÉE ✗'}`);
        
        if (!isValid) {
          console.error(`Le fichier ${filename} n'a pas passé la validation`);
        }
      })
      .catch(error => {
        console.error(`Erreur lors du test de ${filename}:`, error);
      });
  });
  
  // Afficher un message dans l'interface
  const errorMessageElem = document.getElementById('file-error-message');
  if (errorMessageElem) {
    errorMessageElem.textContent = "Test de validation des tâches en cours... Vérifiez la console pour les résultats.";
    errorMessageElem.style.color = "#2e8b57"; // Vert forêt
  }
  
  console.log("----- FIN DU TEST DE VALIDATION DES TÂCHES -----");
});

document.addEventListener('DOMContentLoaded', function() {
  initializeNewProjectModal();
});

// Separate initialization function that can be called when the modal is loaded dynamically
function initializeNewProjectModal() {
  // Get DOM elements
  const modal = document.getElementById('newProjectModal');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelButton');
  const createBtn = document.getElementById('createButton');
  const projectTypes = document.querySelectorAll('.project-type');
  const scaleSelect = document.getElementById('scale');
  
  // Initialize state
  let selectedProjectType = null;
  
  // Focus on the project name input
  setTimeout(() => {
      const projectNameInput = document.getElementById('project-name');
      if (projectNameInput) projectNameInput.focus();
  }, 100);
  
  // Set up event listeners for project types
  projectTypes.forEach(type => {
      type.addEventListener('click', function() {
          // Remove selected class from all types
          projectTypes.forEach(t => t.classList.remove('selected'));
          
          // Add selected class to clicked type
          this.classList.add('selected');
          
          // Update selected project type
          selectedProjectType = this.getAttribute('data-type');
      });
  });
  
  // Set the first project type as selected by default
  if (projectTypes.length > 0) {
      projectTypes[0].classList.add('selected');
      selectedProjectType = projectTypes[0].getAttribute('data-type');
  }
  
  // Handle custom scale selection
  scaleSelect.addEventListener('change', function() {
      const customScaleContainer = document.querySelector('.custom-scale-container');
      
      if (!customScaleContainer) {
          // Create custom scale input if it doesn't exist
          if (this.value === 'custom') {
              const container = document.createElement('div');
              container.className = 'custom-scale-container visible';
              container.innerHTML = `
                  <span>1:</span>
                  <input type="number" id="custom-scale-value" min="1" placeholder="Enter scale">
              `;
              
              this.parentNode.appendChild(container);
          }
      } else {
          // Toggle visibility of existing custom scale input
          if (this.value === 'custom') {
              customScaleContainer.classList.add('visible');
          } else {
              customScaleContainer.classList.remove('visible');
          }
      }
  });
  
  // Close modal function is handled by the parent page
  
  // Handle create button click
  createBtn.addEventListener('click', function() {
      const projectName = document.getElementById('project-name').value.trim();
      let scale = document.getElementById('scale').value;
      
      // Get custom scale value if selected
      if (scale === 'custom') {
          const customScaleInput = document.getElementById('custom-scale-value');
          if (customScaleInput && customScaleInput.value) {
              scale = `1:${customScaleInput.value}`;
          }
      }
      
      // Validate inputs
      if (!projectName) {
          alert('Please enter a project name');
          return;
      }
      
      if (!selectedProjectType) {
          alert('Please select a project type');
          return;
      }
      
      // Create project object with all the data
      const projectData = {
          name: projectName,
          type: selectedProjectType,
          scale: scale,
          createdAt: new Date().toISOString()
      };
      
      // Log the project data for demo purposes
      console.log('Creating new project:', projectData);
      
      // Store project data in localStorage
      let projects = JSON.parse(localStorage.getItem('planwiseProjects') || '[]');
      projects.push(projectData);
      localStorage.setItem('planwiseProjects', JSON.stringify(projects));
      
      // Create file in the file system
      if (window.addNewFile) {
          window.addNewFile(selectedProjectType, projectName);
      }
      
      // Alert success and close modal
      alert(`Project "${projectName}" created successfully!`);
      
      // Close the modal (will be handled by parent page)
      if (window.closeModal) {
          window.closeModal();
      } else {
          // Fallback if closeModal function isn't available
          const modalOverlay = modal.closest('.modal-overlay');
          if (modalOverlay) {
              document.body.removeChild(modalOverlay);
          }
      }
  });
}

// Execute the initialization function if this script is loaded after the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initializeNewProjectModal, 1);
}
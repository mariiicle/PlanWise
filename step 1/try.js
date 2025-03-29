// DOM Elements
const newProjectBtn = document.querySelector('.new-btn');
const closeModalBtn = document.querySelector('.close-modal');
const modal = document.getElementById('fileModal');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const toolCards = document.querySelectorAll('.tool-card');
const upgradeButtons = document.querySelectorAll('.upgrade-btn');
const navItems = document.querySelectorAll('.nav-item');
const modalTitle = document.getElementById('modal-title');
const projectNameInput = document.getElementById('file-name');
const projectTypeSelect = document.getElementById('project-type');
const descriptionTextarea = document.getElementById('file-content');
const createdDateSpan = document.getElementById('created-date');
const modifiedDateSpan = document.getElementById('modified-date');
const searchInput = document.querySelector('.search-bar input');
const addProjectBtn = document.querySelector('.add-project');
const userAvatar = document.querySelector('.user-avatar');
const userProfile = document.querySelector('.user-profile');

// Master Planner elements
const masterPlannerModal = document.getElementById('masterPlannerModal');
const tabBtns = document.querySelectorAll('.tab-btn');
const workflowLinks = document.querySelectorAll('.workflow-link');
const projectNameElement = document.getElementById('project-name');
const projectCategoryElement = document.getElementById('project-category');
const progressCircleText = document.querySelector('.progress-text');
const progressBars = document.querySelectorAll('.progress-fill');
const moduleStatus = document.querySelectorAll('.module-status');

document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.querySelector('.user-avatar');
    const userDropdown = document.getElementById('userDropdown');
    
    // Toggle dropdown
    userAvatar.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });

    // Prevent dropdown from closing when clicking inside
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Handle dropdown item clicks
    const dropdownItems = userDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            switch(action) {
                case 'profile':
                    console.log('Navigate to profile');
                    break;
                case 'settings':
                    console.log('Open account settings');
                    break;
                case 'subscription':
                    console.log('Open subscription management');
                    break;
                case 'logout':
                    console.log('Logout user');
                    break;
            }
            userDropdown.classList.remove('show');
        });
    });
});

// Store projects data
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let currentProjectId = null;

// Initialize the application
function init() {
    loadProjects();
    setupEventListeners();
    updateUI();
}

// Set up all event listeners
function setupEventListeners() {
    // Modal controls
    newProjectBtn.addEventListener('click', openNewProjectModal);
    
    // Find all close modal buttons (now multiple due to Master Planner modal)
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentModal = this.closest('.modal');
            if (parentModal) parentModal.style.display = 'none';
        });
    });
    
    saveBtn.addEventListener('click', saveProject);
    deleteBtn.addEventListener('click', deleteProject);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    });

    // Tool cards
    toolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-btn')) {
                const toolName = card.querySelector('h3').textContent.trim();
                
                // Special handling for Master Planner
                if (toolName.includes('Master Planner')) {
                    openMasterPlanner();
                } else {
                    openToolModal(toolName);
                }
            }
        });
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            updateContentBasedOnNav(item);
        });
    });

    // Upgrade buttons
    upgradeButtons.forEach(button => {
        button.addEventListener('click', showUpgradeOptions);
    });

    // Search functionality
    searchInput.addEventListener('input', searchProjects);
    
    // Add project from sidebar
    addProjectBtn.addEventListener('click', openNewProjectModal);
    
    // User profile click
    userAvatar.addEventListener('click', toggleUserMenu);
    userProfile.addEventListener('click', toggleProjectDropdown);
    
    // Module checkboxes
    const moduleCheckboxes = document.querySelectorAll('.module-check input');
    moduleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProjectProgress);
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Master Planner tab navigation
    setupMasterPlannerTabs();
    
    // Master Planner workflow links
    setupWorkflowLinks();
    
    // Master Planner save button
    const masterPlannerSaveBtn = document.querySelector('.master-planner-modal .save-btn');
    if (masterPlannerSaveBtn) {
        masterPlannerSaveBtn.addEventListener('click', saveMasterPlannerProgress);
    }
    
    // Master Planner export button
    const masterPlannerExportBtn = document.querySelector('.master-planner-modal .export-btn');
    if (masterPlannerExportBtn) {
        masterPlannerExportBtn.addEventListener('click', exportMasterPlannerProject);
    }
    
    // Tool buttons in Master Planner
    setupToolButtonListeners();
}

// Setup Master Planner tab navigation
function setupMasterPlannerTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Show the selected tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup Master Planner workflow links
function setupWorkflowLinks() {
    workflowLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the tab to show
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and add to selected
            tabBtns.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-tab') === tabId) {
                    tab.classList.add('active');
                }
            });
            
            // Hide all tab panes and show selected
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup tool button listeners in Master Planner
function setupToolButtonListeners() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simulate tool interaction - in a real app this would do more
            showNotification(`${this.textContent.trim()} tool activated`);
            
            // Mark module as in progress
            updateModuleProgress(this.closest('.tab-pane').id, 50);
        });
    });
}

// Open Master Planner interface
function openMasterPlanner() {
    // If there are no projects, create one
    if (projects.length === 0) {
        createNewProject('Master Plan Project');
    }
    
    // Load the most recent project into Master Planner
    loadProjectIntoMasterPlanner(projects[0]);
    
    // Display the Master Planner modal
    masterPlannerModal.style.display = 'block';
}

// Create a new project with the given name
function createNewProject(name) {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    
    const newProject = {
        id: Date.now().toString(),
        name: name,
        type: 'residential',
        description: 'Created from Master Planner.',
        created: formattedDate,
        modified: formattedDate,
        completedModules: [],
        progress: 0,
        starred: false,
        moduleProgress: {
            'vicinity': 0,
            'site': 0,
            'matrix': 0,
            'bubble': 0,
            'zoning': 0
        }
    };
    
    projects.unshift(newProject);
    saveProjects();
    return newProject;
}

// Load project data into Master Planner interface
function loadProjectIntoMasterPlanner(project) {
    if (!project) return;
    
    currentProjectId = project.id;
    
    // Update project info
    projectNameElement.textContent = project.name;
    projectCategoryElement.textContent = project.type;
    
    // Update progress circle
    progressCircleText.textContent = `${project.progress}%`;
    
    // Update module progress bars and status
    updateAllModuleProgressBars(project);
}

// Update all module progress bars based on project data
function updateAllModuleProgressBars(project) {
    const moduleMapping = {
        'vicinity-map': 'vicinity',
        'site-analysis': 'site',
        'matrix-diagram': 'matrix',
        'bubble-diagram': 'bubble',
        'zoning': 'zoning'
    };
    
    // Initialize moduleProgress if it doesn't exist
    if (!project.moduleProgress) {
        project.moduleProgress = {
            'vicinity': 0,
            'site': 0,
            'matrix': 0,
            'bubble': 0,
            'zoning': 0
        };
        
        // Calculate progress based on completed modules
        project.completedModules.forEach(module => {
            const shortName = moduleMapping[module];
            if (shortName) {
                project.moduleProgress[shortName] = 100;
            }
        });
    }
    
    // Update progress bars and status text
    const modules = ['vicinity', 'site', 'matrix', 'bubble', 'zoning'];
    modules.forEach((module, index) => {
        const progress = project.moduleProgress[module] || 0;
        
        // Update progress bar
        if (progressBars[index]) {
            progressBars[index].style.width = `${progress}%`;
        }
        
        // Update status text
        if (moduleStatus[index]) {
            if (progress === 0) {
                moduleStatus[index].textContent = 'Not Started';
            } else if (progress < 100) {
                moduleStatus[index].textContent = 'In Progress';
            } else {
                moduleStatus[index].textContent = 'Completed';
            }
        }
    });
}

// Update progress for a specific module
function updateModuleProgress(moduleId, progressValue) {
    if (!currentProjectId) return;
    
    const projectIndex = projects.findIndex(project => project.id === currentProjectId);
    if (projectIndex === -1) return;
    
    // Make sure moduleProgress exists
    if (!projects[projectIndex].moduleProgress) {
        projects[projectIndex].moduleProgress = {
            'vicinity': 0,
            'site': 0,
            'matrix': 0,
            'bubble': 0,
            'zoning': 0
        };
    }
    
    // Update the progress for the specific module
    projects[projectIndex].moduleProgress[moduleId] = progressValue;
    
    // Recalculate overall progress
    const modules = ['vicinity', 'site', 'matrix', 'bubble', 'zoning'];
    const totalProgress = modules.reduce((sum, module) => {
        return sum + (projects[projectIndex].moduleProgress[module] || 0);
    }, 0);
    
    projects[projectIndex].progress = Math.round(totalProgress / modules.length);
    
    // Update the UI
    progressCircleText.textContent = `${projects[projectIndex].progress}%`;
    
    // Update module progress bars and status
    updateAllModuleProgressBars(projects[projectIndex]);
    
    // Update completedModules based on 100% progress
    const moduleMapping = {
        'vicinity': 'vicinity-map',
        'site': 'site-analysis',
        'matrix': 'matrix-diagram',
        'bubble': 'bubble-diagram',
        'zoning': 'zoning'
    };
    
    projects[projectIndex].completedModules = [];
    for (const [shortName, progress] of Object.entries(projects[projectIndex].moduleProgress)) {
        if (progress === 100 && moduleMapping[shortName]) {
            projects[projectIndex].completedModules.push(moduleMapping[shortName]);
        }
    }
    
    // Update modified date
    const now = new Date();
    projects[projectIndex].modified = now.toLocaleString();
    
    // Save changes
    saveProjects();
}

// Save Master Planner progress
function saveMasterPlannerProgress() {
    if (!currentProjectId) return;
    
    // In a real app, this would save more detailed data
    showNotification('Project progress saved');
}

// Export Master Planner project
function exportMasterPlannerProject() {
    if (!currentProjectId) return;
    
    // In a real app, this would generate exportable files
    showNotification('Exporting project data...');
    setTimeout(() => {
        showNotification('Project exported successfully');
    }, 1500);
}

// Open modal for creating a new project
function openNewProjectModal() {
    modalTitle.textContent = 'Create New Project';
    projectNameInput.value = '';
    projectTypeSelect.value = 'residential';
    descriptionTextarea.value = '';
    
    const now = new Date();
    const formattedDate = now.toLocaleString();
    createdDateSpan.textContent = formattedDate;
    modifiedDateSpan.textContent = formattedDate;
    
    // Clear checkboxes
    const moduleCheckboxes = document.querySelectorAll('.module-check input');
    moduleCheckboxes.forEach(checkbox => checkbox.checked = false);
    
    currentProjectId = null;
    deleteBtn.style.display = 'none';
    modal.style.display = 'flex';
}

// Open modal for a specific tool
function openToolModal(toolName) {
    modalTitle.textContent = toolName;
    
    // If no project exists, create one
    if (projects.length === 0) {
        projectNameInput.value = 'New ' + toolName + ' Project';
        projectTypeSelect.value = 'residential';
        descriptionTextarea.value = 'Created from ' + toolName + ' tool.';
        
        const now = new Date();
        const formattedDate = now.toLocaleString();
        createdDateSpan.textContent = formattedDate;
        modifiedDateSpan.textContent = formattedDate;
        
        // Check the related module checkbox
        checkRelatedModule(toolName);
        
        currentProjectId = null;
        deleteBtn.style.display = 'none';
    } else {
        // Open most recent project and check the related module
        loadProject(projects[0].id);
        checkRelatedModule(toolName);
    }
    
    modal.style.display = 'flex';
}

// Check the related module checkbox based on tool name
function checkRelatedModule(toolName) {
    let moduleId;
    
    switch(toolName) {
        case 'Vicinity Map':
            moduleId = 'vicinity-map';
            break;
        case 'Site Analysis':
            moduleId = 'site-analysis';
            break;
        case 'Matrix Diagram':
            moduleId = 'matrix-diagram';
            break;
        case 'Bubble Diagram':
            moduleId = 'bubble-diagram';
            break;
        case 'Zoning':
            moduleId = 'zoning';
            break;
        default:
            return;
    }
    
    const checkbox = document.getElementById(moduleId);
    if (checkbox) checkbox.checked = true;
}

// Close the modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Save project data
function saveProject() {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    
    const moduleCheckboxes = document.querySelectorAll('.module-check input');
    const completedModules = Array.from(moduleCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
    
    // Get progress percentage
    const progress = Math.round((completedModules.length / moduleCheckboxes.length) * 100);
    
    if (currentProjectId) {
        // Update existing project
        const projectIndex = projects.findIndex(project => project.id === currentProjectId);
        if (projectIndex !== -1) {
            // Create moduleProgress object if it doesn't exist
            if (!projects[projectIndex].moduleProgress) {
                projects[projectIndex].moduleProgress = {
                    'vicinity': 0,
                    'site': 0,
                    'matrix': 0,
                    'bubble': 0,
                    'zoning': 0
                };
            }
            
            // Update module progress based on completed modules
            const moduleMapping = {
                'vicinity-map': 'vicinity',
                'site-analysis': 'site',
                'matrix-diagram': 'matrix',
                'bubble-diagram': 'bubble',
                'zoning': 'zoning'
            };
            
            // Reset module progress
            for (const key in projects[projectIndex].moduleProgress) {
                projects[projectIndex].moduleProgress[key] = 0;
            }
            
            // Set completed modules to 100%
            completedModules.forEach(module => {
                const shortName = moduleMapping[module];
                if (shortName) {
                    projects[projectIndex].moduleProgress[shortName] = 100;
                }
            });
            
            projects[projectIndex] = {
                ...projects[projectIndex],
                name: projectNameInput.value,
                type: projectTypeSelect.value,
                description: descriptionTextarea.value,
                modified: formattedDate,
                completedModules,
                progress
            };
        }
    } else {
        // Create new project
        const moduleMapping = {
            'vicinity-map': 'vicinity',
            'site-analysis': 'site',
            'matrix-diagram': 'matrix',
            'bubble-diagram': 'bubble',
            'zoning': 'zoning'
        };
        
        // Create moduleProgress object
        const moduleProgress = {
            'vicinity': 0,
            'site': 0,
            'matrix': 0,
            'bubble': 0,
            'zoning': 0
        };
        
        // Set completed modules to 100%
        completedModules.forEach(module => {
            const shortName = moduleMapping[module];
            if (shortName) {
                moduleProgress[shortName] = 100;
            }
        });
        
        const newProject = {
            id: Date.now().toString(),
            name: projectNameInput.value,
            type: projectTypeSelect.value,
            description: descriptionTextarea.value,
            created: formattedDate,
            modified: formattedDate,
            completedModules,
            progress,
            starred: false,
            moduleProgress
        };
        
        projects.unshift(newProject);
    }
    
    // Save to localStorage and update UI
    saveProjects();
    closeModal();
    showNotification(currentProjectId ? 'Project updated successfully' : 'Project created successfully');
}

// Delete current project
function deleteProject() {
    if (!currentProjectId) return;
    
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(project => project.id !== currentProjectId);
        saveProjects();
        closeModal();
        showNotification('Project deleted');
    }
}

// Load project data into modal
function loadProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    currentProjectId = project.id;
    modalTitle.textContent = 'Edit Project';
    projectNameInput.value = project.name;
    projectTypeSelect.value = project.type;
    descriptionTextarea.value = project.description;
    createdDateSpan.textContent = project.created;
    modifiedDateSpan.textContent = project.modified;
    
    // Set checkbox states
    const moduleCheckboxes = document.querySelectorAll('.module-check input');
    moduleCheckboxes.forEach(checkbox => {
        checkbox.checked = project.completedModules.includes(checkbox.id);
    });
    
    deleteBtn.style.display = 'block';
    modal.style.display = 'flex';
}

// Update project progress when checkboxes are changed
function updateProjectProgress() {
    if (!currentProjectId) return;
    
    const moduleCheckboxes = document.querySelectorAll('.module-check input');
    const completedModules = Array.from(moduleCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
    
    // Get progress percentage
    const progress = Math.round((completedModules.length / moduleCheckboxes.length) * 100);
    
    const projectIndex = projects.findIndex(project => project.id === currentProjectId);
    if (projectIndex !== -1) {
        // Create moduleProgress object if it doesn't exist
        if (!projects[projectIndex].moduleProgress) {
            projects[projectIndex].moduleProgress = {
                'vicinity': 0,
                'site': 0,
                'matrix': 0,
                'bubble': 0,
                'zoning': 0
            };
        }
        
        // Update module progress based on completed modules
        const moduleMapping = {
            'vicinity-map': 'vicinity',
            'site-analysis': 'site',
            'matrix-diagram': 'matrix',
            'bubble-diagram': 'bubble',
            'zoning': 'zoning'
        };
        
        // Reset module progress
        for (const key in projects[projectIndex].moduleProgress) {
            projects[projectIndex].moduleProgress[key] = 0;
        }
        
        // Set completed modules to 100%
        completedModules.forEach(module => {
            const shortName = moduleMapping[module];
            if (shortName) {
                projects[projectIndex].moduleProgress[shortName] = 100;
            }
        });
        
        projects[projectIndex].completedModules = completedModules;
        projects[projectIndex].progress = progress;
        
        // Update modified date
        const now = new Date();
        projects[projectIndex].modified = now.toLocaleString();
        modifiedDateSpan.textContent = projects[projectIndex].modified;
        
        saveProjects();
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
    loadProjects();
}

// Load projects from localStorage
function loadProjects() {
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    updateUI();
}

// Update UI based on project data
function updateUI() {
    // If we implement a projects list view, we would update it here
    console.log('Projects updated:', projects);
}

// Update content based on navigation selection
function updateContentBasedOnNav(navItem) {
    const navText = navItem.querySelector('span').textContent;
    console.log(`Navigated to: ${navText}`);
    
    // In a full implementation, we would update the main content area
    // based on the selected navigation item
}

// Show upgrade options modal
function showUpgradeOptions() {
    alert('Upgrade to PlanWise Pro for additional features!');
    // In a full implementation, this would open an upgrade modal
}

// Search projects functionality
function searchProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
    
    // In a full implementation, we would filter the projects list
    // based on the search term
}

// Toggle user menu
function toggleUserMenu() {
    console.log('User menu toggled');
    // In a full implementation, this would show a dropdown menu
}

// Toggle project dropdown
function toggleProjectDropdown() {
    console.log('Project dropdown toggled');
    // In a full implementation, this would show/hide project options
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to body and remove after animation
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + N: New project
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openNewProjectModal();
    }
    
    // Escape: Close modal
    if (e.key === 'Escape' && (modal.style.display === 'flex' || masterPlannerModal.style.display === 'block')) {
        closeModal();
    }
    
    // Ctrl/Cmd + S: Save project when modal is open
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (modal.style.display === 'flex') {
            e.preventDefault();
            saveProject();
        } else if (masterPlannerModal.style.display === 'block') {
            e.preventDefault();
            saveMasterPlannerProgress();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add sample projects for demonstration (remove in production)
function addSampleProjects() {
    if (!localStorage.getItem('sampleProjectsAdded')) {
        const sampleProjects = [
            {
                id: '1',
                name: 'Modern Residential Complex',
                type: 'residential',
                description: 'A modern residential complex with community facilities.',
                created: '3/20/2025, 9:30:00 AM',
                modified: '3/21/2025, 2:45:00 PM',
                completedModules: ['vicinity-map', 'site-analysis', 'matrix-diagram'],
                progress: 60,
                starred: true,
                moduleProgress: {
                    'vicinity': 100,
                    'site': 100,
                    'matrix': 100,
                    'bubble': 0,
                    'zoning': 0
                }
            },
            {
                id: '2',
                name: 'Downtown Office Building',
                type: 'commercial',
                description: 'A 12-story office building in the downtown area.',
                created: '3/15/2025, 10:15:00 AM',
                modified: '3/19/2025, 4:20:00 PM',
                completedModules: ['vicinity-map', 'site-analysis'],
                progress: 40,
                starred: false,
                moduleProgress: {
                    'vicinity': 100,
                    'site': 100,
                    'matrix': 0,
                    'bubble': 0,
                    'zoning': 0
                }
            }
        ];
        
        projects = sampleProjects;
        saveProjects();
        localStorage.setItem('sampleProjectsAdded', 'true');
    }
}

// Call to add sample projects
addSampleProjects();
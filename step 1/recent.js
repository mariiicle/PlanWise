// Sample project data
const projectsData = [
    // Your existing project data
];

// DOM Elements
const projectsList = document.getElementById('projectsList');
const newProjectBtn = document.querySelector('.new-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const dropdowns = document.querySelectorAll('.dropdown');
const periodBtns = document.querySelectorAll('.period-btn');
const newProjectModal = document.getElementById('newProjectModal');
const projectDetailsModal = document.getElementById('projectDetailsModal');

// Current view state
let currentView = 'grid';
let currentSort = 'modified';
let currentFilter = 'all';
let currentPeriod = 'week';
let selectedProjectId = null;

// Initialize the app
function init() {
    renderProjects();
    setupEventListeners();
}

// Render projects based on current view, sort and filter
function renderProjects() {
    // Clear existing projects
    projectsList.innerHTML = '';
    
    // Filter projects
    let filteredProjects = [...projectsData];
    
    if (currentFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.type === currentFilter);
    }
    
    // Filter by time period
    const now = new Date();
    let cutoffDate;
    
    switch (currentPeriod) {
        case 'week':
            cutoffDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case 'year':
            cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
    }
    
    filteredProjects = filteredProjects.filter(project => new Date(project.modified) >= cutoffDate);
    
    // Sort projects
    filteredProjects.sort((a, b) => {
        switch (currentSort) {
            case 'modified':
                return new Date(b.modified) - new Date(a.modified);
            case 'created':
                return new Date(b.created) - new Date(a.created);
            case 'name':
                return a.title.localeCompare(b.title);
            case 'type':
                return a.type.localeCompare(b.type);
        }
    });
    
    // Set the correct view class
    projectsList.className = `projects-list ${currentView === 'list' ? 'list-view' : ''}`;
    
    // Check if there are any projects to display
    if (filteredProjects.length === 0) {
        renderEmptyState();
    } else {
        // Render projects
        filteredProjects.forEach(project => {
            projectsList.appendChild(createProjectCard(project));
        });
    }
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;
    
    // Format dates
    const modifiedDate = new Date(project.modified);
    const formattedDate = `${modifiedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    
    // Create collaborators HTML
    let collaboratorsHTML = '';
    project.collaborators.forEach((collab, index) => {
        if (index < 3) {
            collaboratorsHTML += `<div class="collaborator" style="background-color: hsl(${(index * 60) % 360}, 70%, 65%)">${collab}</div>`;
        }
    });
    
    if (project.collaborators.length > 3) {
        collaboratorsHTML += `<div class="collaborator more">+${project.collaborators.length - 3}</div>`;
    }
    
    // Card content
    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon ${project.iconClass}">
                <i class="${project.icon}"></i>
            </div>
            <div class="project-title-area">
                <div class="project-title">${project.title}</div>
                <div class="project-info">
                    <span><i class="fas fa-tasks"></i> ${project.tasks}</span>
                    <span><i class="fas fa-comment"></i> ${project.comments}</span>
                </div>
            </div>
            <button class="menu-trigger" data-id="${project.id}">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        </div>
        <div class="project-meta">
            <div class="project-collaborators">
                ${collaboratorsHTML}
            </div>
            <div class="project-date">
                <i class="fas fa-clock"></i> ${formattedDate}
            </div>
        </div>
    `;
    
    // Add event listeners
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-trigger')) {
            // Open project (simulate navigation)
            console.log(`Opening project: ${project.title}`);
        }
    });
    
    const menuButton = card.querySelector('.menu-trigger');
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedProjectId = project.id;
        openProjectDetails(project);
    });
    
    return card;
}

// Render empty state when no projects are found
function renderEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    emptyState.innerHTML = `
        <div style="margin-bottom: 20px;">
            <i class="fas fa-clock" style="font-size: 64px; color: #bdc3c7; background-color: #f7f9fa; padding: 24px; border-radius: 50%;"></i>
        </div>
        <h2 style="font-size: 24px; margin-bottom: 12px;">No recent files yet</h2>
        <p style="color: #7f8c8d; max-width: 400px; margin: 0 auto 24px;">
            Create and work on files to see them appear here for quick access
        </p>
        <button class="browse-files-btn" style="background-color: var(--primary-color); color: white; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 500; cursor: pointer;">
            <i class="fas fa-search"></i> Browse Files
        </button>
    `;
    
    projectsList.appendChild(emptyState);
    
    // Add event listener to the browse files button
    const browseFilesBtn = emptyState.querySelector('.browse-files-btn');
    browseFilesBtn.addEventListener('click', () => {
        // Simulate navigation to browse files
        console.log('Navigating to browse files');
    });
}

// Set up all event listeners
function setupEventListeners() {
    // View toggle buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all view buttons
            viewBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Set current view based on icon
            if (btn.querySelector('i').classList.contains('fa-th')) {
                currentView = 'grid';
            } else {
                currentView = 'list';
            }
            
            renderProjects();
        });
    });
    
    // Dropdown toggles
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            // Close all other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            
            // Toggle this dropdown
            this.classList.toggle('active');
        });
        
        // Add click event to dropdown items
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Get the dropdown parent and span
                const parentDropdown = item.closest('.dropdown');
                const dropdownSpan = parentDropdown.querySelector('span');
                
                // Update the dropdown text
                dropdownSpan.textContent = item.textContent;
                
                // Update the current state
                if (parentDropdown.textContent.includes('Last modified')) {
                    currentSort = item.getAttribute('data-value');
                } else {
                    currentFilter = item.getAttribute('data-value');
                }
                
                // Close the dropdown
                parentDropdown.classList.remove('active');
                
                // Render projects with new filters
                renderProjects();
            });
        });
    });
    
    // Period buttons
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all period buttons
            periodBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Set current period
            currentPeriod = btn.getAttribute('data-period');
            
            // Render projects with new period
            renderProjects();
        });
    });
    
    // New project button
    newProjectBtn.addEventListener('click', () => {
        // Show the new project modal
        newProjectModal.classList.add('active');
    });
    
    // Close modals when clicking the close button
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Save button in new project modal
    document.querySelector('#newProjectModal #save-btn').addEventListener('click', () => {
        // Handle saving the new project
        createNewProject();
    });
    
    // Save button in project details modal
    document.querySelector('#projectDetailsModal #save-btn').addEventListener('click', () => {
        // Handle saving project details
        saveProjectDetails();
    });
    
    // Delete button in project details modal
    document.querySelector('#projectDetailsModal #delete-btn').addEventListener('click', () => {
        // Handle deleting project
        deleteProject();
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Create a new project
function createNewProject() {
    // Get values from the form
    const projectName = document.querySelector('#projectName').value;
    const projectType = document.querySelector('#projectType').value;
    const projectDescription = document.querySelector('#projectDescription').value;
    
    if (!projectName) {
        alert('Please enter a project name');
        return;
    }
    
    // Create a new project object
    const newProject = {
        id: projectsData.length + 1,
        title: projectName,
        type: projectType,
        description: projectDescription,
        icon: getIconForType(projectType),
        iconClass: getIconClassForType(projectType),
        modified: new Date().toISOString(),
        created: new Date().toISOString(),
        collaborators: ['ME'],
        tasks: 0,
        comments: 0,
        starred: false
    };
    
    // Add the new project to the array
    projectsData.unshift(newProject);
    
    // Close the modal
    newProjectModal.classList.remove('active');
    
    // Clear the form
    document.querySelector('#projectName').value = '';
    document.querySelector('#projectType').value = 'document';
    document.querySelector('#projectDescription').value = '';
    
    // Render the projects
    renderProjects();
}

// Save project details
function saveProjectDetails() {
    if (!selectedProjectId) return;
    
    // Find the project in the data
    const projectIndex = projectsData.findIndex(p => p.id === parseInt(selectedProjectId));
    
    if (projectIndex !== -1) {
        // Update project data
        projectsData[projectIndex].title = document.querySelector('#file-name').value;
        projectsData[projectIndex].description = document.querySelector('#file-content').value;
        projectsData[projectIndex].starred = document.querySelector('#starred-checkbox').checked;
        projectsData[projectIndex].modified = new Date().toISOString();
        
        // Close the modal
        projectDetailsModal.classList.remove('active');
        
        // Render the projects
        renderProjects();
    }
}

// Delete project
function deleteProject() {
    if (!selectedProjectId) return;
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this project?')) {
        // Find and remove the project
        const projectIndex = projectsData.findIndex(p => p.id === parseInt(selectedProjectId));
        
        if (projectIndex !== -1) {
            projectsData.splice(projectIndex, 1);
            
            // Close the modal
            projectDetailsModal.classList.remove('active');
            
            // Render the projects
            renderProjects();
        }
    }
}

// Get icon class for project type
function getIconClassForType(type) {
    switch (type) {
        case 'document':
            return 'purple';
        case 'mindmap':
            return 'pink';
        case 'flowchart':
            return 'blue';
        case 'diagram':
            return 'green';
        default:
            return 'purple';
    }
}

// Get icon for project type
function getIconForType(type) {
    switch (type) {
        case 'document':
            return 'fas fa-file-alt';
        case 'mindmap':
            return 'fas fa-sitemap';
        case 'flowchart':
            return 'fas fa-project-diagram';
        case 'diagram':
            return 'fas fa-bezier-curve';
        default:
            return 'fas fa-file-alt';
    }
}

// Open project details
function openProjectDetails(project) {
    // Find the project in the data
    const projectData = projectsData.find(p => p.id === parseInt(project.id));
    
    if (projectData) {
        // Populate the modal with project data
        document.querySelector('#modal-title').textContent = projectData.title;
        document.querySelector('#file-name').value = projectData.title;
        document.querySelector('#file-content').value = projectData.description || '';
        document.querySelector('#created-date').textContent = new Date(projectData.created).toLocaleString();
        document.querySelector('#modified-date').textContent = new Date(projectData.modified).toLocaleString();
        document.querySelector('#starred-checkbox').checked = projectData.starred;
        
        // Show the modal
        projectDetailsModal.classList.add('active');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
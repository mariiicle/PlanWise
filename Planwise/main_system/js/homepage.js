// DOM Elements
const newProjectBtn = document.querySelector('.new-btn');
const closeModalBtn = document.querySelector('.close-modal');
const modal = document.getElementById('fileModal');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const modalTitle = document.getElementById('modal-title');
const projectNameInput = document.getElementById('file-name');
const projectTypeSelect = document.getElementById('project-type');
const descriptionTextarea = document.getElementById('file-content');
const createdDateSpan = document.getElementById('created-date');
const modifiedDateSpan = document.getElementById('modified-date');
const searchInput = document.querySelector('.search-bar input');
const addProjectBtn = document.querySelector('.add-project');
const toolCards = document.querySelectorAll('.tool-card');
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.main-content > div');

// Store projects data
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let currentProjectId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home.html'); // Load home page by default
    loadProjects();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    newProjectBtn.addEventListener('click', openNewProjectModal);
    closeModalBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveProject);
    deleteBtn.addEventListener('click', deleteProject);
    searchInput.addEventListener('input', searchProjects);
    addProjectBtn.addEventListener('click', openNewProjectModal);

    toolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-btn')) {
                console.log(`Selected tool: ${card.querySelector('h3').textContent.trim()}`);
                openNewProjectModal();
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) closeModal();
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('.nav-item.active')?.classList.remove('active');
            item.classList.add('active');

            let page = '';
            switch (item.innerText.trim()) {
                case 'Home':
                    page = 'home.html';
                    break;
                case 'Recent':
                    page = 'recent.html'; // Placeholder for future pages
                    break;
                case 'Starred':
                    page = 'starred.html';
                    break;
                case 'Projects':
                    page = 'project.html';
                    break;
                case 'Recycle Bin':
                    page = 'recycle-bin.html';
                    break;
                default:
                    page = 'home.html';
            }

            loadPage(page);
        });
    });
}

// Load page dynamically
function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.querySelector('.main-content').innerHTML = data;
        })
        .catch(error => console.error('Error loading page:', error));
}

// Open modal for creating a new project
function openNewProjectModal() {
    modalTitle.textContent = 'Create New Project';
    projectNameInput.value = '';
    projectTypeSelect.value = 'residential';
    descriptionTextarea.value = '';
    const now = new Date().toLocaleString();
    createdDateSpan.textContent = now;
    modifiedDateSpan.textContent = now;
    currentProjectId = null;
    deleteBtn.style.display = 'none';
    modal.style.display = 'flex';
}

// Close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Save project data
function saveProject() {
    const now = new Date().toLocaleString();
    const projectName = projectNameInput.value.trim();
    const projectType = projectTypeSelect.value.trim();
    const description = descriptionTextarea.value.trim();

    if (!projectName || !projectType || !description) {
        alert('Please fill in all fields before saving');
        return;
    }

    if (currentProjectId) {
        const projectIndex = projects.findIndex(p => p.id === currentProjectId);
        if (projectIndex !== -1) {
            projects[projectIndex] = { ...projects[projectIndex], name: projectName, type: projectType, description, modified: now };
        }
    } else {
        projects.unshift({ id: Date.now().toString(), name: projectName, type: projectType, description, created: now, modified: now });
    }

    saveProjects();
    showNotification(currentProjectId ? 'Project updated successfully' : 'Project created successfully');
    closeModal();
}

// Delete current project
function deleteProject() {
    if (!currentProjectId) return;
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(project => project.id !== currentProjectId);
        saveProjects();
        closeModal();
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
}

// Search projects
function searchProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
}

// Show notification function
function showNotification(message) {
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

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

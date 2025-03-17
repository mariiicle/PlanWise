// Global variable to expose addNewFile function
let addNewFile;

document.addEventListener('DOMContentLoaded', function() {
    // File data store
    let fileStore = {
        files: [],
        selectedFile: null,
        history: []
    };
    
    // Load data from localStorage
    function loadData() {
        const savedData = localStorage.getItem('fileManagementData');
        if (savedData) {
            fileStore = JSON.parse(savedData);
            renderFiles();
        } else {
            // Add some sample files if no data exists
            addSampleFiles();
        }
    }
    
    // Save data to localStorage
    function saveData() {
        localStorage.setItem('fileManagementData', JSON.stringify(fileStore));
    }
    
    // File and project data stores
    let projectStore = {
        projects: [],
        selectedProject: null
    };
    
    // DOM elements
    const homeNav = document.getElementById('homeNav');
    const recentNav = document.getElementById('recentNav');
    const starredNav = document.getElementById('starredNav');
    const templatesNav = document.getElementById('templatesNav');
    const projectsNav = document.getElementById('projectsNav');
    const allFilesNav = document.getElementById('allFilesNav');
    const recycleBinNav = document.getElementById('recycleBinNav');
    
    const homeTabContent = document.getElementById('homeTabContent');
    const recentTabContent = document.getElementById('recentTabContent');
    const starredTabContent = document.getElementById('starredTabContent');
    const templatesTabContent = document.getElementById('templatesTabContent');
    const projectsTabContent = document.getElementById('projectsTabContent');
    const allFilesTabContent = document.getElementById('allFilesTabContent');
    const recycleBinTabContent = document.getElementById('recycleBinTabContent');
    
    const fileListContainer = document.getElementById('fileList');
    const newFileBtn = document.getElementById('newFileBtn');
    const projectListContainer = document.getElementById('projectList');
    
    // Set up navigation event listeners
    if (homeNav) homeNav.addEventListener('click', () => switchTab('homeTab'));
    if (recentNav) recentNav.addEventListener('click', () => switchTab('recentTab'));
    if (starredNav) starredNav.addEventListener('click', () => switchTab('starredTab'));
    if (templatesNav) templatesNav.addEventListener('click', () => switchTab('templatesTab'));
    if (projectsNav) projectsNav.addEventListener('click', () => switchTab('projectsTab'));
    if (allFilesNav) allFilesNav.addEventListener('click', () => switchTab('allFilesTab'));
    if (recycleBinNav) recycleBinNav.addEventListener('click', () => switchTab('recycleBinTab'));
    
    // Function to switch between tabs
    function switchTab(tabId) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tab => tab.classList.add('hidden'));
        
        // Deactivate all nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        // Show selected tab content and activate nav item
        const selectedTabContent = document.getElementById(tabId + 'Content');
        const selectedNavItem = document.getElementById(tabId + 'Nav');
        
        if (selectedTabContent) selectedTabContent.classList.remove('hidden');
        if (selectedNavItem) selectedNavItem.classList.add('active');
        
        // Render appropriate content based on tab
        if (tabId === 'allFilesTab') {
            renderAllFiles();
        } else if (tabId === 'recentTab') {
            renderRecentFiles();
        } else if (tabId === 'starredTab') {
            renderStarredFiles();
        } else if (tabId === 'projectsTab') {
            renderProjects();
        } else if (tabId === 'recycleBinTab') {
            renderDeletedFiles();
        }
    }
    
    // Function to add sample files
    function addSampleFiles() {
        const sampleFiles = [
            { id: 'file1', name: 'Project Proposal', type: 'document', starred: false, created: new Date().toISOString(), modified: new Date().toISOString(), deleted: false },
            { id: 'file2', name: 'Budget Spreadsheet', type: 'spreadsheet', starred: true, created: new Date().toISOString(), modified: new Date().toISOString(), deleted: false },
            { id: 'file3', name: 'Presentation Slides', type: 'presentation', starred: false, created: new Date().toISOString(), modified: new Date().toISOString(), deleted: false }
        ];
        
        fileStore.files = sampleFiles;
        saveData();
        renderFiles();
    }
    
    // Function to add sample projects
    function addSampleProjects() {
        const sampleProjects = [
            { id: 'proj1', name: 'Marketing Campaign', fileIds: ['file1'] },
            { id: 'proj2', name: 'Product Launch', fileIds: ['file2', 'file3'] }
        ];
        
        projectStore.projects = sampleProjects;
        localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
        renderProjects();
    }
    
    // Function to render all files
    function renderAllFiles() {
        const activeFiles = fileStore.files.filter(file => !file.deleted);
        const container = allFilesTabContent ? allFilesTabContent.querySelector('.file-list-container') : null;
        renderFileList(activeFiles, container);
    }
    
    // Function to render recent files
    function renderRecentFiles() {
        const recentFiles = [...fileStore.files]
            .filter(file => !file.deleted)
            .sort((a, b) => new Date(b.modified) - new Date(a.modified))
            .slice(0, 5);
        
        const container = recentTabContent ? recentTabContent.querySelector('.file-list-container') : null;
        renderFileList(recentFiles, container);
    }
    
    // Function to render starred files
    function renderStarredFiles() {
        const starredFiles = fileStore.files.filter(file => file.starred && !file.deleted);
        const container = starredTabContent ? starredTabContent.querySelector('.file-list-container') : null;
        renderFileList(starredFiles, container);
    }
    
    // Function to render deleted files
    function renderDeletedFiles() {
        const deletedFiles = fileStore.files.filter(file => file.deleted);
        const container = recycleBinTabContent ? recycleBinTabContent.querySelector('.file-list-container') : null;
        renderFileList(deletedFiles, container);
    }
    
    // Function to render projects
    function renderProjects() {
        if (!projectListContainer) return;
        
        projectListContainer.innerHTML = '';
        
        projectStore.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.innerHTML = `
                <div class="project-name">${project.name}</div>
                <div class="project-actions">
                    <button class="edit-project-btn" data-id="${project.id}">Edit</button>
                    <button class="delete-project-btn" data-id="${project.id}">Delete</button>
                </div>
            `;
            
            projectElement.addEventListener('click', () => selectProject(project.id));
            projectListContainer.appendChild(projectElement);
        });
    }
    
    // Function to render file list
    function renderFileList(files, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (files.length === 0) {
            container.innerHTML = '<div class="empty-message">No files to display</div>';
            return;
        }
        
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            fileElement.dataset.id = file.id;
            
            const iconClass = getFileIconClass(file.type);
            
            fileElement.innerHTML = `
                <div class="file-icon ${iconClass}"></div>
                <div class="file-name">${file.name}</div>
                <div class="file-modified">Modified: ${formatDate(file.modified)}</div>
                <div class="file-actions">
                    <button class="star-btn ${file.starred ? 'starred' : ''}" data-id="${file.id}">
                        <i class="fa ${file.starred ? 'fa-star' : 'fa-star-o'}"></i>
                    </button>
                    <button class="edit-btn" data-id="${file.id}">Edit</button>
                    ${!file.deleted ? 
                        `<button class="delete-btn" data-id="${file.id}">Delete</button>` : 
                        `<button class="restore-btn" data-id="${file.id}">Restore</button>
                         <button class="permanently-delete-btn" data-id="${file.id}">Permanently Delete</button>`
                    }
                </div>
            `;
            
            fileElement.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    selectFile(file.id);
                }
            });
            
            container.appendChild(fileElement);
        });
        
        // Add event listeners for file actions
        container.querySelectorAll('.star-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                toggleStarFile(e.target.closest('button').dataset.id);
                e.stopPropagation();
            });
        });
        
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                editFile(e.target.dataset.id);
                e.stopPropagation();
            });
        });
        
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                deleteFile(e.target.dataset.id);
                e.stopPropagation();
            });
        });
        
        container.querySelectorAll('.restore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                restoreFile(e.target.dataset.id);
                e.stopPropagation();
            });
        });
        
        container.querySelectorAll('.permanently-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                permanentlyDeleteFile(e.target.dataset.id);
                e.stopPropagation();
            });
        });
    }
    
    // Helper function to get file icon class
    function getFileIconClass(fileType) {
        switch(fileType) {
            case 'document':
                return 'document-icon';
            case 'spreadsheet':
                return 'spreadsheet-icon';
            case 'presentation':
                return 'presentation-icon';
            default:
                return 'file-icon';
        }
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    // Function to select a file
    function selectFile(fileId) {
        fileStore.selectedFile = fileId;
        
        // Add to history
        fileStore.history = fileStore.history.filter(id => id !== fileId);
        fileStore.history.unshift(fileId);
        
        // Update file's modified date
        const fileIndex = fileStore.files.findIndex(file => file.id === fileId);
        if (fileIndex !== -1) {
            fileStore.files[fileIndex].modified = new Date().toISOString();
        }
        
        saveData();
        highlightSelectedFile(fileId);
        
        // Here you would typically open the file in an editor
        openFileInEditor(fileId);
    }
    
    // Function to highlight selected file
    function highlightSelectedFile(fileId) {
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`.file-item[data-id="${fileId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    }
    
    // Function to open file in editor
    function openFileInEditor(fileId) {
        const file = fileStore.files.find(f => f.id === fileId);
        if (!file) return;
        
        // Implement file opening logic here
        console.log(`Opening file: ${file.name}`);
        // This would typically involve loading file content into an editor
    }
    
    // Function to toggle star on a file
    function toggleStarFile(fileId) {
        const fileIndex = fileStore.files.findIndex(file => file.id === fileId);
        if (fileIndex !== -1) {
            fileStore.files[fileIndex].starred = !fileStore.files[fileIndex].starred;
            saveData();
            renderFiles();
        }
    }
    
    // Function to edit a file
    function editFile(fileId) {
        const file = fileStore.files.find(f => f.id === fileId);
        if (!file) return;
        
        const newName = prompt('Enter new file name:', file.name);
        if (newName && newName !== file.name) {
            file.name = newName;
            file.modified = new Date().toISOString();
            saveData();
            renderFiles();
        }
    }
    
    // Function to delete a file (move to recycle bin)
    function deleteFile(fileId) {
        const fileIndex = fileStore.files.findIndex(file => file.id === fileId);
        if (fileIndex !== -1) {
            fileStore.files[fileIndex].deleted = true;
            saveData();
            renderFiles();
        }
    }
    
    // Function to restore a file from recycle bin
    function restoreFile(fileId) {
        const fileIndex = fileStore.files.findIndex(file => file.id === fileId);
        if (fileIndex !== -1) {
            fileStore.files[fileIndex].deleted = false;
            saveData();
            renderFiles();
        }
    }
    
    // Function to permanently delete a file
    function permanentlyDeleteFile(fileId) {
        if (confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
            fileStore.files = fileStore.files.filter(file => file.id !== fileId);
            fileStore.history = fileStore.history.filter(id => id !== fileId);
            
            // Also remove from any projects
            projectStore.projects.forEach(project => {
                project.fileIds = project.fileIds.filter(id => id !== fileId);
            });
            
            saveData();
            localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
            renderFiles();
        }
    }
    
    // Function to select a project
    function selectProject(projectId) {
        projectStore.selectedProject = projectId;
        localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
        
        const project = projectStore.projects.find(p => p.id === projectId);
        if (project) {
            // Filter files to show only those in this project
            const projectFiles = fileStore.files.filter(file => 
                project.fileIds.includes(file.id) && !file.
                project.fileIds.includes(file.id) && !file.deleted
            );
            
            const projectFilesContainer = projectsTabContent ? projectsTabContent.querySelector('.project-files-container') : null;
            if (projectFilesContainer) {
                renderFileList(projectFiles, projectFilesContainer);
            }
        }
    }
    
    // Function to render files
    function renderFiles() {
        renderAllFiles();
        renderRecentFiles();
        renderStarredFiles();
        
        // If a project is selected, render its files
        if (projectStore.selectedProject) {
            const project = projectStore.projects.find(p => p.id === projectStore.selectedProject);
            if (project) {
                const projectFiles = fileStore.files.filter(file => 
                    project.fileIds.includes(file.id) && !file.deleted
                );
                
                const projectFilesContainer = projectsTabContent ? projectsTabContent.querySelector('.project-files-container') : null;
                if (projectFilesContainer) {
                    renderFileList(projectFiles, projectFilesContainer);
                }
            }
        }
    }
    
    // Function to create a new file
    function createNewFile(fileType) {
        const fileId = 'file' + Date.now();
        const fileName = `New ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}`;
        
        const newFile = {
            id: fileId,
            name: fileName,
            type: fileType,
            starred: false,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            deleted: false,
            content: ''
        };
        
        fileStore.files.push(newFile);
        saveData();
        
        // If a project is selected, add the file to that project
        if (projectStore.selectedProject) {
            const projectIndex = projectStore.projects.findIndex(p => p.id === projectStore.selectedProject);
            if (projectIndex !== -1) {
                projectStore.projects[projectIndex].fileIds.push(fileId);
                localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
            }
        }
        
        renderFiles();
        return fileId;
    }
    
    // Function to create a new project
    function createNewProject(projectName) {
        const projectId = 'proj' + Date.now();
        
        const newProject = {
            id: projectId,
            name: projectName,
            fileIds: []
        };
        
        projectStore.projects.push(newProject);
        localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
        
        renderProjects();
        return projectId;
    }
    
    // Function to delete a project
    function deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project? The files in this project will not be deleted.')) {
            projectStore.projects = projectStore.projects.filter(p => p.id !== projectId);
            
            if (projectStore.selectedProject === projectId) {
                projectStore.selectedProject = null;
            }
            
            localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
            renderProjects();
        }
    }
    
    // Function to edit a project
    function editProject(projectId) {
        const project = projectStore.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const newName = prompt('Enter new project name:', project.name);
        if (newName && newName !== project.name) {
            project.name = newName;
            localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
            renderProjects();
        }
    }
    
    // Function to add a file to a project
    function addFileToProject(fileId, projectId) {
        const projectIndex = projectStore.projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) return;
        
        if (!projectStore.projects[projectIndex].fileIds.includes(fileId)) {
            projectStore.projects[projectIndex].fileIds.push(fileId);
            localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
            
            if (projectStore.selectedProject === projectId) {
                renderProjects();
            }
        }
    }
    
    // Function to remove a file from a project
    function removeFileFromProject(fileId, projectId) {
        const projectIndex = projectStore.projects.findIndex(p => p.id === projectId);
        if (projectIndex === -1) return;
        
        projectStore.projects[projectIndex].fileIds = projectStore.projects[projectIndex].fileIds.filter(id => id !== fileId);
        localStorage.setItem('projectManagementData', JSON.stringify(projectStore));
        
        if (projectStore.selectedProject === projectId) {
            renderProjects();
        }
    }
    
    // Set up event listener for new file button
    if (newFileBtn) {
        newFileBtn.addEventListener('click', () => {
            // Show file type selector dropdown or modal
            showFileTypeSelector();
        });
    }
    
    // Function to show file type selector
    function showFileTypeSelector() {
        const modal = document.createElement('div');
        modal.className = 'file-type-modal';
        modal.innerHTML = `
            <div class="file-type-modal-content">
                <h3>Select File Type</h3>
                <div class="file-type-options">
                    <button class="file-type-option" data-type="document">
                        <div class="file-type-icon document-icon"></div>
                        <div class="file-type-name">Document</div>
                    </button>
                    <button class="file-type-option" data-type="spreadsheet">
                        <div class="file-type-icon spreadsheet-icon"></div>
                        <div class="file-type-name">Spreadsheet</div>
                    </button>
                    <button class="file-type-option" data-type="presentation">
                        <div class="file-type-icon presentation-icon"></div>
                        <div class="file-type-name">Presentation</div>
                    </button>
                </div>
                <div class="modal-actions">
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners to file type options
        modal.querySelectorAll('.file-type-option').forEach(option => {
            option.addEventListener('click', () => {
                const fileType = option.dataset.type;
                const newFileId = createNewFile(fileType);
                
                // Close modal
                document.body.removeChild(modal);
                
                // Open the new file
                selectFile(newFileId);
            });
        });
        
        // Add event listener to cancel button
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Add event listener to close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Function to empty recycle bin
    function emptyRecycleBin() {
        if (confirm('Are you sure you want to permanently delete all files in the recycle bin? This action cannot be undone.')) {
            fileStore.files = fileStore.files.filter(file => !file.deleted);
            saveData();
            renderDeletedFiles();
        }
    }
    
    // Set up event listener for empty recycle bin button
    const emptyRecycleBinBtn = document.getElementById('emptyRecycleBinBtn');
    if (emptyRecycleBinBtn) {
        emptyRecycleBinBtn.addEventListener('click', emptyRecycleBin);
    }
    
    // Function to restore all files from recycle bin
    function restoreAllFiles() {
        fileStore.files.forEach(file => {
            if (file.deleted) {
                file.deleted = false;
            }
        });
        
        saveData();
        renderDeletedFiles();
    }
    
    // Set up event listener for restore all button
    const restoreAllBtn = document.getElementById('restoreAllBtn');
    if (restoreAllBtn) {
        restoreAllBtn.addEventListener('click', restoreAllFiles);
    }
    
    // Function to create a new file (exposed globally)
    addNewFile = function(fileType) {
        return createNewFile(fileType);
    };
    
    // Load project data from localStorage
    function loadProjectData() {
        const savedData = localStorage.getItem('projectManagementData');
        if (savedData) {
            projectStore = JSON.parse(savedData);
        } else {
            // Add sample projects if no data exists
            addSampleProjects();
        }
    }
    
    // Initialize the app
    loadData();
    loadProjectData();
    
    // Default to home tab
    switchTab('homeTab');
});

// Add this function to the window object so it can be called from outside
window.addNewFile = addNewFile;

// Function to show template gallery
function showTemplateGallery() {
    const templates = [
        { id: 'template1', name: 'Budget Report', type: 'spreadsheet', thumbnail: 'images/templates/budget.png' },
        { id: 'template2', name: 'Project Proposal', type: 'document', thumbnail: 'images/templates/proposal.png' },
        { id: 'template3', name: 'Sales Presentation', type: 'presentation', thumbnail: 'images/templates/presentation.png' }
    ];
    
    const modal = document.createElement('div');
    modal.className = 'template-modal';
    modal.innerHTML = `
        <div class="template-modal-content">
            <h3>Template Gallery</h3>
            <div class="template-grid">
                ${templates.map(template => `
                    <div class="template-item" data-id="${template.id}" data-type="${template.type}">
                        <div class="template-thumbnail">
                            <img src="${template.thumbnail}" alt="${template.name}">
                        </div>
                        <div class="template-name">${template.name}</div>
                        <div class="template-type">${template.type}</div>
                    </div>
                `).join('')}
            </div>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners to template items
    modal.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', () => {
            const templateId = item.dataset.id;
            const templateType = item.dataset.type;
            
            // Create new file from template
            const fileId = window.addNewFile(templateType);
            
            // Close modal
            document.body.removeChild(modal);
            
            // Here you would typically load the template content into the file
            console.log(`Creating new file from template: ${templateId}`);
        });
    });
    
    // Add event listener to cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Add event listener to close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Add this function to the window object so it can be called from outside
window.showTemplateGallery = showTemplateGallery;

// Listen for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl+N for new file
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        showFileTypeSelector();
    }
    
    // Ctrl+P for new project
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        const projectName = prompt('Enter project name:');
        if (projectName) {
            createNewProject(projectName);
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for starred files
    const starredFiles = [
        {
            id: 1,
            name: "Site Analysis - Downtown Project",
            type: "document",
            createdAt: "2025-01-15T14:30:00",
            modifiedAt: "2025-03-10T09:45:00",
            content: "This is a detailed site analysis for the Downtown Project focusing on urban context, circulation patterns, and environmental factors.",
            starred: true
        },
        {
            id: 2,
            name: "Residential Zone Planning",
            type: "diagram",
            createdAt: "2025-02-21T10:15:00",
            modifiedAt: "2025-03-12T16:20:00",
            content: "Spatial organization diagram for the new residential development showing relationships between public and private spaces.",
            starred: true
        },
        {
            id: 3,
            name: "Project Timeline - Q2 2025",
            type: "mindmap",
            createdAt: "2025-03-01T13:45:00",
            modifiedAt: "2025-03-15T11:30:00",
            content: "Comprehensive timeline mapping all project milestones and dependencies for Q2 2025.",
            starred: true
        },
        {
            id: 4,
            name: "Client Meeting Notes",
            type: "document",
            createdAt: "2025-02-10T15:00:00",
            modifiedAt: "2025-03-14T10:25:00",
            content: "Notes from the client meeting discussing project requirements, budget constraints, and timeline expectations.",
            starred: true
        },
        {
            id: 5,
            name: "Campus Master Plan",
            type: "diagram",
            createdAt: "2025-01-05T09:20:00",
            modifiedAt: "2025-03-08T14:15:00",
            content: "Master plan diagram showing the proposed campus layout with building footprints, circulation paths, and landscape features.",
            starred: true
        }
    ];

    // DOM elements
    const starredFilesContainer = document.getElementById('starred-files');
    const emptyState = document.getElementById('empty-state');
    const viewButtons = document.querySelectorAll('.view-btn');
    const modal = document.getElementById('fileModal');
    const closeModalButton = document.querySelector('.close-modal');
    const saveButton = document.getElementById('save-btn');
    const deleteButton = document.getElementById('delete-btn');
    
    // Get dropdown elements
    const sortDropdown = document.querySelector('.view-controls .dropdown:first-child');
    const typeFilterDropdown = document.querySelector('.view-controls .dropdown:nth-child(2)');
    
    // Current view and filter states
    let currentView = 'grid'; // 'grid' or 'list'
    let currentTypeFilter = 'all'; // 'all', 'document', 'diagram', 'mindmap'
    let currentSortMethod = 'modified'; // 'modified', 'created', 'name', 'type'
    let currentFileId = null;
    let workingFiles = [...starredFiles]; // Clone the array to work with

    // Initialize the page
    function init() {
        renderFiles();
        setupEventListeners();
    }

    // Sort files based on current sort method
    function sortFiles(files) {
        return [...files].sort((a, b) => {
            switch (currentSortMethod) {
                case 'modified':
                    return new Date(b.modifiedAt) - new Date(a.modifiedAt);
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });
    }

    // Filter files based on current type filter
    function filterFiles() {
        let filtered = [...starredFiles];
        
        // Apply type filter
        if (currentTypeFilter !== 'all') {
            filtered = filtered.filter(file => file.type === currentTypeFilter);
        }
        
        // Apply sorting
        return sortFiles(filtered);
    }

    // Render files based on current filter and view
    function renderFiles() {
        starredFilesContainer.innerHTML = '';
        workingFiles = filterFiles();
        
        if (workingFiles.length === 0) {
            starredFilesContainer.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        
        starredFilesContainer.style.display = 'grid'; // Always use grid for layout
        if (currentView === 'list') {
            starredFilesContainer.classList.add('list-view');
            starredFilesContainer.classList.remove('files-grid');
        } else {
            starredFilesContainer.classList.add('files-grid');
            starredFilesContainer.classList.remove('list-view');
        }
        
        emptyState.style.display = 'none';
        
        workingFiles.forEach(file => {
            if (currentView === 'grid') {
                renderGridItem(file);
            } else {
                renderListItem(file);
            }
        });
    }
    
    // Render a file as a grid item
    function renderGridItem(file) {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        fileCard.dataset.id = file.id;
        
        const fileTypeClass = getFileTypeClass(file.type);
        const fileTypeIcon = getFileTypeIcon(file.type);
        const formattedDate = formatDate(new Date(file.modifiedAt));
        
        fileCard.innerHTML = `
            <div class="file-badge">${capitalizeFirstLetter(file.type)}</div>
            <button class="star-btn" data-id="${file.id}"><i class="fas fa-star"></i></button>
            <div class="file-preview ${fileTypeClass}">
                <i class="${fileTypeIcon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span>Modified ${formattedDate}</span>
                </div>
            </div>
        `;
        
        starredFilesContainer.appendChild(fileCard);
    }
    
    // Render a file as a list item
    function renderListItem(file) {
        const listItem = document.createElement('div');
        listItem.className = 'file-card list-item';
        listItem.dataset.id = file.id;
        
        const fileTypeClass = getFileTypeClass(file.type);
        const fileTypeIcon = getFileTypeIcon(file.type);
        const createdDate = formatDate(new Date(file.createdAt));
        const modifiedDate = formatDate(new Date(file.modifiedAt));
        
        listItem.innerHTML = `
            <div class="file-preview ${fileTypeClass}">
                <i class="${fileTypeIcon}"></i>
            </div>
            <div class="file-info list-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span>Created: ${createdDate}</span>
                    <span>Modified: ${modifiedDate}</span>
                    <span>${capitalizeFirstLetter(file.type)}</span>
                </div>
            </div>
            <button class="star-btn" data-id="${file.id}"><i class="fas fa-star"></i></button>
        `;
        
        starredFilesContainer.appendChild(listItem);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Handle dropdowns toggling
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                // Only toggle if clicking the dropdown itself or its direct children
                // (not the dropdown items in dropdown-content)
                if (e.target === this || e.target.parentElement === this || 
                    e.target.tagName === 'SPAN' || e.target.tagName === 'I') {
                    
                    // Close all other dropdowns first
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== this) d.classList.remove('active');
                    });
                    
                    // Toggle this dropdown
                    this.classList.toggle('active');
                    e.stopPropagation();
                }
            });
        });
        
        // Handle sort dropdown item clicks
        sortDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                currentSortMethod = this.getAttribute('data-value');
                
                // Update dropdown text
                sortDropdown.querySelector('span').textContent = this.textContent;
                
                // Close dropdown
                sortDropdown.classList.remove('active');
                
                renderFiles();
            });
        });
        
        // Handle type filter dropdown item clicks
        typeFilterDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                currentTypeFilter = this.getAttribute('data-value');
                
                // Update dropdown text
                typeFilterDropdown.querySelector('span').textContent = this.textContent;
                
                // Close dropdown
                typeFilterDropdown.classList.remove('active');
                
                renderFiles();
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        });
        
        // View buttons
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                currentView = this.querySelector('.fa-th') ? 'grid' : 'list';
                renderFiles();
            });
        });
        
        // Delegate clicks on the files container
        starredFilesContainer.addEventListener('click', function(e) {
            // Handle star button clicks
            if (e.target.closest('.star-btn')) {
                const starBtn = e.target.closest('.star-btn');
                const fileId = parseInt(starBtn.dataset.id || starBtn.closest('.file-card').dataset.id);
                toggleStarStatus(fileId);
                e.stopPropagation();
                return;
            }
            
            // Handle file card clicks
            const fileCard = e.target.closest('.file-card');
            if (fileCard) {
                openFileModal(parseInt(fileCard.dataset.id));
            }
        });
        
        // Close modal
        closeModalButton.addEventListener('click', closeModal);
        
        // Save changes
        saveButton.addEventListener('click', saveChanges);
        
        // Delete file
        deleteButton.addEventListener('click', deleteFile);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Browse files button in empty state
        const browseButton = document.querySelector('.browse-btn');
        if (browseButton) {
            browseButton.addEventListener('click', function() {
                // For demonstration we'll reset filters to show all files
                currentTypeFilter = 'all';
                typeFilterDropdown.querySelector('span').textContent = 'All types';
                renderFiles();
            });
        }
    }
    
    // Toggle star status of a file
    function toggleStarStatus(fileId) {
        const fileIndex = starredFiles.findIndex(f => f.id === fileId);
        
        if (fileIndex !== -1) {
            starredFiles[fileIndex].starred = !starredFiles[fileIndex].starred;
            
            // If unstarred, remove from the starred files list
            if (!starredFiles[fileIndex].starred) {
                starredFiles.splice(fileIndex, 1);
            }
            
            renderFiles();
        }
    }
    
    // Open file modal
    function openFileModal(fileId) {
        const file = starredFiles.find(f => f.id === fileId);
        if (!file) return;
        
        currentFileId = fileId;
        
        document.getElementById('modal-title').textContent = file.name;
        document.getElementById('file-name').value = file.name;
        document.getElementById('file-content').value = file.content;
        document.getElementById('created-date').textContent = new Date(file.createdAt).toLocaleString();
        document.getElementById('modified-date').textContent = new Date(file.modifiedAt).toLocaleString();
        document.getElementById('starred-checkbox').checked = file.starred;
        
        modal.style.display = 'flex';
    }
    
    // Close file modal
    function closeModal() {
        modal.style.display = 'none';
        currentFileId = null;
    }
    
    // Save changes to a file
    function saveChanges() {
        if (currentFileId === null) return;
        
        const fileIndex = starredFiles.findIndex(f => f.id === currentFileId);
        if (fileIndex === -1) return;
        
        const newName = document.getElementById('file-name').value.trim();
        const newContent = document.getElementById('file-content').value.trim();
        const isStarred = document.getElementById('starred-checkbox').checked;
        
        if (newName) {
            starredFiles[fileIndex].name = newName;
            starredFiles[fileIndex].content = newContent;
            starredFiles[fileIndex].modifiedAt = new Date().toISOString();
            
            // Handle star status change
            if (starredFiles[fileIndex].starred !== isStarred) {
                starredFiles[fileIndex].starred = isStarred;
                
                // If unstarred, remove from the starred files list
                if (!isStarred) {
                    starredFiles.splice(fileIndex, 1);
                }
            }
            
            renderFiles();
            closeModal();
        } else {
            alert('File name cannot be empty');
        }
    }
    
    // Delete a file
    function deleteFile() {
        if (currentFileId === null) return;
        
        const fileIndex = starredFiles.findIndex(f => f.id === currentFileId);
        if (fileIndex === -1) return;
        
        if (confirm('Are you sure you want to delete this file?')) {
            starredFiles.splice(fileIndex, 1);
            renderFiles();
            closeModal();
        }
    }
    
    // Helper functions
    function getFileTypeClass(type) {
        switch (type) {
            case 'document': return 'document';
            case 'diagram': return 'diagram';
            case 'mindmap': return 'mindmap';
            default: return '';
        }
    }
    
    function getFileTypeIcon(type) {
        switch (type) {
            case 'document': return 'fas fa-file-alt';
            case 'diagram': return 'fas fa-project-diagram';
            case 'mindmap': return 'fas fa-sitemap';
            default: return 'fas fa-file';
        }
    }
    
    function formatDate(date) {
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Initialize the page
    init();
    });
// Define initial admin data
const adminData = [
    { 
        id: 1, 
        firstName: 'Carl', 
        lastName: 'Nataño', 
        email: 'carlnataño@planwise.com',
        role: 'super-admin',
        dateAdded: '2023-01-15',
        status: 'active',
        permissions: ['dashboard', 'users', 'projects', 'subscriptions', 'sales', 'pricing', 'admin']
    },
    { 
        id: 2, 
        firstName: 'Marithes', 
        lastName: 'Miraflor', 
        email: 'marimiraflr@planwise.com',
        role: 'admin',
        dateAdded: '2023-02-20',
        status: 'active',
        permissions: ['dashboard', 'users', 'projects', 'subscriptions', 'sales']
    },
    { 
        id: 3, 
        firstName: 'Geirwin', 
        lastName: 'Sumaculub', 
        email: 'geirwins@planwise.com',
        role: 'editor',
        dateAdded: '2023-03-10',
        status: 'active',
        permissions: ['dashboard', 'projects']
    },
    { 
        id: 4, 
        firstName: 'John Angelo', 
        lastName: 'Masicap', 
        email: 'keme1@planwise.com',
        role: 'eme',
        dateAdded: '2023-04-05',
        status: 'inactive',
        permissions: ['-']
    },
    { 
        id: 5, 
        firstName: 'Igan', 
        lastName: 'Tajanlangit', 
        email: 'iganagi@planwise.com',
        role: 'super-admin',
        dateAdded: '2023-01-15',
        status: 'active',
        permissions: ['dashboard', 'users', 'projects', 'subscriptions', 'sales', 'pricing', 'admin']
    },
];

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Function to show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notification.className = `notification ${type}`;
    notificationMessage.textContent = message;
    
    notification.style.display = 'block';
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Pagination variables
let currentPage = 1;
const itemsPerPage = 5;

// Function to populate admin table with pagination
function populateAdminTable(data, page = 1) {
    const tableBody = document.getElementById('admin-table-body');
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    
    if (paginatedData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No admins found</td></tr>`;
        return;
    }
    
    paginatedData.forEach(admin => {
        const row = document.createElement('tr');
        
        // Disable actions for super-admin if not the logged-in user
        const isCurrentUser = admin.id === 1; // Assuming ID 1 is the logged-in super admin
        const isSuperAdmin = admin.role === 'super-admin';
        
        row.innerHTML = `
            <td>${admin.firstName} ${admin.lastName}</td>
            <td>${admin.email}</td>
            <td><span class="role-badge role-${admin.role}">${admin.role.replace('-', ' ')}</span></td>
            <td>${formatDate(admin.dateAdded)}</td>
            <td>${admin.status === 'active' ? 
                  '<span style="color: #28a745;">● Active</span>' : 
                  '<span style="color: #dc3545;">● Inactive</span>'}</td>
            <td>
                <button class="action-btn view-btn" title="View Details" ${isSuperAdmin && !isCurrentUser ? 'disabled' : ''}>
                    <i class="uil uil-eye"></i>
                </button>
                <button class="action-btn edit-btn" title="Edit" ${isSuperAdmin && !isCurrentUser ? 'disabled' : ''}>
                    <i class="uil uil-edit"></i>
                </button>
                <button class="action-btn delete-btn" title="Delete" data-id="${admin.id}" 
                        data-name="${admin.firstName} ${admin.lastName}" 
                        ${isSuperAdmin ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="uil uil-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Add event listener to delete button
        const deleteBtn = row.querySelector('.delete-btn');
        if (!isSuperAdmin) {
            deleteBtn.addEventListener('click', function() {
                const adminId = this.getAttribute('data-id');
                const adminName = this.getAttribute('data-name');
                openDeleteModal(adminId, adminName);
            });
        }
    });
    
    // Update pagination
    updatePagination(data.length, page);
}

// Function to update pagination controls
function updatePagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationEl = document.getElementById('pagination');
    paginationEl.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('pagination-btn');
    prevBtn.innerHTML = '<i class="uil uil-angle-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            populateAdminTable(adminData, currentPage - 1);
        }
    });
    paginationEl.appendChild(prevBtn);
    
    // Page buttons
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('pagination-btn');
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            populateAdminTable(adminData, i);
        });
        paginationEl.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('pagination-btn');
    nextBtn.innerHTML = '<i class="uil uil-angle-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            populateAdminTable(adminData, currentPage + 1);
        }
    });
    paginationEl.appendChild(nextBtn);
}

// Function to handle searching admins
function searchAdmins(query) {
    if (!query) {
        populateAdminTable(adminData);
        return;
    }
    
    query = query.toLowerCase();
    const filteredData = adminData.filter(admin => {
        const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
        const email = admin.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
    });
    
    populateAdminTable(filteredData);
}

// Function to open delete modal
function openDeleteModal(adminId, adminName) {
    const modal = document.getElementById('delete-modal');
    const nameSpan = document.getElementById('delete-admin-name');
    const confirmBtn = document.getElementById('confirm-delete');
    
    nameSpan.textContent = adminName;
    modal.style.display = 'block';
    
    // Set up confirm button
    confirmBtn.onclick = function() {
        deleteAdmin(adminId);
        modal.style.display = 'none';
    };
    
    // Set up cancel and close buttons
    document.getElementById('cancel-delete').onclick = function() {
        modal.style.display = 'none';
    };
    
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Function to delete admin
function deleteAdmin(adminId) {
    const index = adminData.findIndex(admin => admin.id == adminId);
    
    if (index !== -1) {
        const adminName = `${adminData[index].firstName} ${adminData[index].lastName}`;
        adminData.splice(index, 1);
        populateAdminTable(adminData, currentPage);
        showNotification(`${adminName} has been removed successfully.`, 'success');
    }
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!firstName || !lastName || !email || !role || !password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    // Get selected permissions
    const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]:checked');
    const permissions = Array.from(permissionCheckboxes).map(checkbox => checkbox.value);
    
    // Create new admin object
    const newAdmin = {
        id: adminData.length + 1,
        firstName,
        lastName,
        email,
        role,
        dateAdded: new Date().toISOString().split('T')[0],
        status: 'active',
        permissions
    };
    
    // Add admin to data array
    adminData.push(newAdmin);
    
    // Update table
    populateAdminTable(adminData);
    
    // Reset form
    document.getElementById('add-admin-form').reset();
      // Show success notification
      showNotification(`${firstName} ${lastName} has been added as ${role} successfully.`, 'success');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Populate admin table on page load
    populateAdminTable(adminData);
    
    // Add form submit event listener
    document.getElementById('add-admin-form').addEventListener('submit', handleFormSubmit);
    
    // Add search event listener
    document.getElementById('admin-search').addEventListener('input', function() {
        searchAdmins(this.value);
    });
    
    // Dark mode toggle
    const modeToggle = document.querySelector('.mode-toggle');
    const body = document.querySelector('body');
    
    modeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
    });
    
    // Sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const nav = document.querySelector('nav');
    
    sidebarToggle.addEventListener('click', () => {
        nav.classList.toggle('close');
    });
    
    // Role selection changes permissions
    document.getElementById('role').addEventListener('change', function() {
        const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]');
        
        if (this.value === 'admin') {
            // Check all permissions except admin management
            permissionCheckboxes.forEach(checkbox => {
                checkbox.checked = checkbox.value !== 'admin';
            });
        } else if (this.value === 'editor') {
            // Only check dashboard and projects
            permissionCheckboxes.forEach(checkbox => {
                checkbox.checked = checkbox.value === 'dashboard' || checkbox.value === 'projects';
            });
        }
    });
});

// Function to handle view admin details
function viewAdminDetails(adminId) {
    const admin = adminData.find(a => a.id == adminId);
    
    if (!admin) return;
    
    // You could show admin details in a modal or redirect to a details page
    console.log('View admin details:', admin);
}

// Function to handle edit admin
function editAdmin(adminId) {
    const admin = adminData.find(a => a.id == adminId);
    
    if (!admin) return;
    
    // Populate form with admin data
    document.getElementById('firstName').value = admin.firstName;
    document.getElementById('lastName').value = admin.lastName;
    document.getElementById('email').value = admin.email;
    document.getElementById('role').value = admin.role === 'super-admin' ? 'admin' : admin.role;
    
    // Check relevant permissions
    const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.checked = admin.permissions.includes(checkbox.value);
    });
    
    // Change form button to update
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="uil uil-save"></i> Update Admin';
    submitBtn.setAttribute('data-id', adminId);
    
    // Scroll to form
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

// Function to toggle admin status
function toggleAdminStatus(adminId) {
    const adminIndex = adminData.findIndex(a => a.id == adminId);
    
    if (adminIndex === -1) return;
    
    // Toggle status
    adminData[adminIndex].status = adminData[adminIndex].status === 'active' ? 'inactive' : 'active';
    
    // Update table
    populateAdminTable(adminData, currentPage);
    
    // Show notification
    const admin = adminData[adminIndex];
    showNotification(`${admin.firstName} ${admin.lastName}'s status has been changed to ${admin.status}.`, 'success');
}

// Add functions to handle bulk actions
function bulkAction(action) {
    const selectedCheckboxes = document.querySelectorAll('.admin-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    
    if (selectedIds.length === 0) {
        showNotification('Please select at least one admin.', 'error');
        return;
    }
    
    if (action === 'activate') {
        // Activate selected admins
        selectedIds.forEach(id => {
            const adminIndex = adminData.findIndex(a => a.id == id);
            if (adminIndex !== -1) {
                adminData[adminIndex].status = 'active';
            }
        });
        showNotification(`${selectedIds.length} admin(s) have been activated.`, 'success');
    } else if (action === 'deactivate') {
        // Deactivate selected admins
        selectedIds.forEach(id => {
            const adminIndex = adminData.findIndex(a => a.id == id);
            if (adminIndex !== -1 && adminData[adminIndex].role !== 'super-admin') {
                adminData[adminIndex].status = 'inactive';
            }
        });
        showNotification(`${selectedIds.length} admin(s) have been deactivated.`, 'success');
    } else if (action === 'delete') {
        // Delete selected admins
        const filteredIds = selectedIds.filter(id => {
            const admin = adminData.find(a => a.id == id);
            return admin && admin.role !== 'super-admin';
        });
        
        if (filteredIds.length === 0) {
            showNotification('Super admin(s) cannot be deleted.', 'error');
            return;
        }
        
        // Remove from data array
        adminData = adminData.filter(admin => {
            return !filteredIds.includes(admin.id.toString()) || admin.role === 'super-admin';
        });
        
        showNotification(`${filteredIds.length} admin(s) have been deleted.`, 'success');
    }
    
    // Update table
    populateAdminTable(adminData, currentPage);
    
    // Uncheck select all checkbox
    document.getElementById('select-all').checked = false;
}

// Function to handle select all checkbox
function handleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const adminCheckboxes = document.querySelectorAll('.admin-checkbox');
    
    adminCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Function to generate a random secure password
function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

// Function to add generate password button functionality
function setupPasswordGenerator() {
    const generateBtn = document.getElementById('generate-password');
    
    generateBtn.addEventListener('click', function() {
        const password = generatePassword();
        document.getElementById('password').value = password;
        document.getElementById('confirmPassword').value = password;
        
        // Show password temporarily
        document.getElementById('password').type = 'text';
        document.getElementById('confirmPassword').type = 'text';
        
        // Hide password after 3 seconds
        setTimeout(() => {
            document.getElementById('password').type = 'password';
            document.getElementById('confirmPassword').type = 'password';
        }, 3000);
        
        // Show notification
        showNotification('Password generated! Will be hidden in 3 seconds.', 'success');
    });
}

// Enhanced validation function for the form
function validateAdminForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Check if email already exists
    const emailExists = adminData.some(admin => admin.email === email);
    if (emailExists) {
        showNotification('Email already exists. Please use a different email.', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate password strength
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return false;
    }
    
    return true;
}

// Function to export admin list to CSV
function exportToCSV() {
    // Column headers
    const headers = ['Name', 'Email', 'Role', 'Date Added', 'Status'];
    
    // Convert data to CSV format
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    adminData.forEach(admin => {
        const row = [
            `${admin.firstName} ${admin.lastName}`,
            admin.email,
            admin.role,
            admin.dateAdded,
            admin.status
        ];
        csvRows.push(row.join(','));
    });
    
    // Create CSV blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'admin-list.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    // Setup password generator
    setupPasswordGenerator();
    
    // Add export button event listener
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
    
    // Add bulk action buttons event listeners
    document.getElementById('bulk-activate').addEventListener('click', () => bulkAction('activate'));
    document.getElementById('bulk-deactivate').addEventListener('click', () => bulkAction('deactivate'));
    document.getElementById('bulk-delete').addEventListener('click', () => bulkAction('delete'));
    
    // Add select all checkbox event listener
    document.getElementById('select-all').addEventListener('change', handleSelectAll);
    
    // Enhanced form validation
    document.getElementById('add-admin-form').addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateAdminForm()) {
            handleFormSubmit(event);
        }
    });
    
    // Add activity log tab functionality
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active-tab'));
            
            // Add active class to clicked tab
            this.classList.add('active-tab');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });
});

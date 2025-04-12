// Define initial pricing data
const pricingData = [
    { id: 1, plan: 'Free', price: 0, features: 'Basic tools, limited exports' },
    { id: 2, plan: 'Student Monthly', price: 199, features: 'Full tools, premium exports' },
    { id: 3, plan: 'Student Annual', price: 1999, features: '2 months free' },
    { id: 4, plan: 'One-Time (6 months)', price: 999, features: 'No recurring fee' },
    { id: 5, plan: 'Lifetime Access', price: 2999, features: 'One-time purchase' }
];

// Define sample price change history
const priceChangeHistory = [
    { 
        date: '2024-03-15', 
        plan: 'Student Monthly', 
        previousPrice: 149, 
        newPrice: 199, 
        changedBy: 'admin@planwise.com',
        status: 'active'
    },
    { 
        date: '2024-03-01', 
        plan: 'Lifetime Access', 
        previousPrice: 2499, 
        newPrice: 2999, 
        changedBy: 'admin@planwise.com',
        status: 'active'
    },
    { 
        date: '2024-04-01', 
        plan: 'Student Annual', 
        previousPrice: 1999, 
        newPrice: 1899, 
        changedBy: 'manager@planwise.com',
        status: 'pending'
    }
];

// Function to format currency
function formatCurrency(value) {
    if (value === 0) return 'Free';
    return '₱' + value.toLocaleString('en-US');
}

// Function to populate the pricing table
function populatePricingTable(data) {
    const tableBody = document.getElementById('pricing-table-body');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.plan}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <input type="number" class="price-input" data-id="${item.id}" 
                       value="${item.price}" min="0" ${item.plan === 'Free' ? 'disabled' : ''}>
            </td>
            <td>
                <input type="text" class="feature-input" data-id="${item.id}" 
                       value="${item.features}">
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Function to populate price change history
function populateHistoryTable(data) {
    const tableBody = document.getElementById('history-table-body');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        
        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.plan}</td>
            <td>${formatCurrency(item.previousPrice)}</td>
            <td>${formatCurrency(item.newPrice)}</td>
            <td>${item.changedBy}</td>
            <td><span class="status ${item.status}">${item.status === 'active' ? 'Active' : 'Pending'}</span></td>
        `;
        
        tableBody.appendChild(row);
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

// Function to handle saving changes
function saveChanges() {
    const priceInputs = document.querySelectorAll('.price-input');
    const featureInputs = document.querySelectorAll('.feature-input');
    let hasChanges = false;
    
    // Check if there are any changes
    priceInputs.forEach(input => {
        const id = parseInt(input.getAttribute('data-id'));
        const newPrice = parseInt(input.value);
        const plan = pricingData.find(item => item.id === id);
        
        if (plan && plan.price !== newPrice) {
            hasChanges = true;
        }
    });
    
    featureInputs.forEach(input => {
        const id = parseInt(input.getAttribute('data-id'));
        const newFeatures = input.value;
        const plan = pricingData.find(item => item.id === id);
        
        if (plan && plan.features !== newFeatures) {
            hasChanges = true;
        }
    });
    
    if (!hasChanges) {
        showNotification('No changes detected', 'error');
        return;
    }
    
    // Simulate API call to save changes
    showNotification('Saving changes...', 'success');
    
    // Simulate delay for API call
    setTimeout(() => {
        // Update pricing data
        priceInputs.forEach(input => {
            const id = parseInt(input.getAttribute('data-id'));
            const newPrice = parseInt(input.value);
            const planIndex = pricingData.findIndex(item => item.id === id);
            
            if (planIndex !== -1 && pricingData[planIndex].price !== newPrice) {
                // Add to history
                priceChangeHistory.unshift({
                    date: new Date().toISOString().split('T')[0],
                    plan: pricingData[planIndex].plan,
                    previousPrice: pricingData[planIndex].price,
                    newPrice: newPrice,
                    changedBy: 'current_admin@planwise.com',
                    status: 'pending'
                });
                
                // Update price
                pricingData[planIndex].price = newPrice;
            }
        });
        
        featureInputs.forEach(input => {
            const id = parseInt(input.getAttribute('data-id'));
            const newFeatures = input.value;
            const planIndex = pricingData.findIndex(item => item.id === id);
            
            if (planIndex !== -1) {
                pricingData[planIndex].features = newFeatures;
            }
        });
        
        // Refresh tables
        populatePricingTable(pricingData);
        populateHistoryTable(priceChangeHistory);
        
        showNotification('Changes saved successfully! Pending approval.', 'success');
    }, 1000);
}

// Function to reset the form
function resetForm() {
    populatePricingTable(pricingData);
    showNotification('Form has been reset', 'success');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    setTimeout(() => {
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('pricing-container').style.display = 'block';
        
        // Populate tables
        populatePricingTable(pricingData);
        populateHistoryTable(priceChangeHistory);
    }, 1000);
    
    // Set up event listeners
    document.getElementById('save-btn').addEventListener('click', saveChanges);
    document.getElementById('reset-btn').addEventListener('click', resetForm);
    
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const sidebar = document.querySelector("nav");
    
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });
    
    // Dark mode toggle
    const modeToggle = document.querySelector(".mode-toggle");
    const body = document.querySelector("body");
    
    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
    });
});
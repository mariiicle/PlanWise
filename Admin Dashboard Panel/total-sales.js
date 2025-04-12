// Initialize empty data structure
const salesData = {
    weekly: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [0, 0, 0, 0, 0, 0, 0],
        total: 0,
        average: 0,
        trend: 0,
        avgTrend: 0
    },
    monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 0,
        average: 0,
        trend: 0,
        avgTrend: 0
    },
    yearly: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        values: [0, 0, 0, 0, 0],
        total: 0,
        average: 0,
        trend: 0,
        avgTrend: 0
    }
};

let salesChart;
let currentPeriod = 'monthly';
let dataLoaded = false;

// Function to format currency
function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Function to update trend indicator
function updateTrendIndicator(container, value) {
    const trendIcon = container.querySelector('i');
    
    if (value > 0) {
        container.className = 'trend up';
        trendIcon.className = 'uil uil-arrow-up';
    } else if (value < 0) {
        container.className = 'trend down';
        trendIcon.className = 'uil uil-arrow-down';
    } else {
        container.className = 'trend';
        trendIcon.className = 'uil uil-minus';
    }
}

// Function to update chart and summary data
function updateChartData(period) {
    const data = salesData[period];
    
    // Update summary boxes
    document.getElementById('total-revenue').textContent = formatCurrency(data.total);
    document.getElementById('revenue-trend').textContent = Math.abs(data.trend) + '%';
    document.getElementById('avg-transaction').textContent = formatCurrency(data.average);
    document.getElementById('avg-trend').textContent = Math.abs(data.avgTrend) + '%';
    
    // Update trend direction
    updateTrendIndicator(document.getElementById('revenue-trend-container'), data.trend);
    updateTrendIndicator(document.getElementById('avg-trend-container'), data.avgTrend);
    
    // Check if we have any data to display
    const hasData = data.values.some(value => value > 0);
    
    if (!hasData) {
        document.getElementById('no-data-container').style.display = 'flex';
        document.getElementById('salesChart').style.display = 'none';
        return;
    } else {
        document.getElementById('no-data-container').style.display = 'none';
        document.getElementById('salesChart').style.display = 'block';
    }
    
    // Update chart
    if (salesChart) {
        salesChart.data.labels = data.labels;
        salesChart.data.datasets[0].data = data.values;
        salesChart.update();
    } else {
        // Create chart for the first time
        const ctx = document.getElementById('salesChart').getContext('2d');
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sales',
                    data: data.values,
                    backgroundColor: 'rgba(105, 92, 254, 0.2)',
                    borderColor: '#695CFE',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: '#695CFE',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Simulated function to fetch data from server
function fetchData() {
    return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
            // This would be replaced with actual API call
            // For now, we're just resolving with empty data
            resolve({
                weekly: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    values: [0, 0, 0, 0, 0, 0, 0],
                    total: 0,
                    average: 0,
                    trend: 0,
                    avgTrend: 0
                },
                monthly: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    total: 0,
                    average: 0,
                    trend: 0,
                    avgTrend: 0
                },
                yearly: {
                    labels: ['2025', '2026', '2027', '2028', '2029'],
                    values: [0, 0, 0, 0, 0],
                    total: 0,
                    average: 0,
                    trend: 0,
                    avgTrend: 0
                }
            });
        }, 1000);
    });
}

// Function to fetch recent sales
function fetchRecentSales() {
    return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
            // This would be replaced with actual API call
            resolve([]);
        }, 1000);
    });
}

// Function to update the recent sales table
function updateRecentSales(sales) {
    const container = document.getElementById('recent-sales-container');
    const loadingElement = document.getElementById('recent-sales-loading');
    const noDataElement = document.getElementById('no-recent-sales');
    
    if (!sales || sales.length === 0) {
        container.style.display = 'none';
        loadingElement.style.display = 'none';
        noDataElement.style.display = 'flex';
        return;
    }
    
    // Clear existing data (except headers)
    const dataColumns = container.querySelectorAll('.data');
    dataColumns.forEach(column => {
        const dataTitle = column.querySelector('.data-title');
        column.innerHTML = '';
        column.appendChild(dataTitle);
    });
    
    // Add new data
    sales.forEach(sale => {
        const transactionIdCol = container.querySelector('.data.names');
        const customerCol = container.querySelector('.data.email');
        const planCol = container.querySelector('.data.plan');
        const amountCol = container.querySelector('.data.amount');
        const dateCol = container.querySelector('.data.date');
        
        const txnSpan = document.createElement('span');
        txnSpan.textContent = sale.id || '';
        transactionIdCol.appendChild(txnSpan);
        
        const custSpan = document.createElement('span');
        custSpan.textContent = sale.customer || '';
        customerCol.appendChild(custSpan);
        
        const planSpan = document.createElement('span');
        planSpan.textContent = sale.plan || '';
        planCol.appendChild(planSpan);
        
        const amountSpan = document.createElement('span');
        amountSpan.textContent = formatCurrency(sale.amount || 0);
        amountCol.appendChild(amountSpan);
        
        const dateSpan = document.createElement('span');
        dateSpan.textContent = sale.date || '';
        dateCol.appendChild(dateSpan);
    });
    
    container.style.display = 'flex';
    loadingElement.style.display = 'none';
    noDataElement.style.display = 'none';
}

// Function to handle incoming data updates
function updateData(newData) {
    // Update our sales data with the new data
    Object.keys(newData).forEach(period => {
        if (newData[period]) {
            salesData[period] = newData[period];
        }
    });
    
    // Update the current view
    updateChartData(currentPeriod);
    
    // Hide loading indicator
    document.getElementById('loading-container').style.display = 'none';
    
    // Mark data as loaded
    dataLoaded = true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set up time period buttons
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update the chart with the selected period
            currentPeriod = this.getAttribute('data-period');
            updateChartData(currentPeriod);
        });
    });
    
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
        
        // Update chart theme if chart exists
        if (salesChart) {
            if (body.classList.contains("dark")) {
                salesChart.options.scales.x.grid.color = 'rgba(255, 255, 255, 0.1)';
                salesChart.options.scales.y.grid.color = 'rgba(255, 255, 255, 0.1)';
                salesChart.options.scales.x.ticks.color = '#f5f5f5';
                salesChart.options.scales.y.ticks.color = '#f5f5f5';
            } else {
                salesChart.options.scales.x.grid.color = 'rgba(0, 0, 0, 0.1)';
                salesChart.options.scales.y.grid.color = 'rgba(0, 0, 0, 0.1)';
                salesChart.options.scales.x.ticks.color = '#333';
                salesChart.options.scales.y.ticks.color = '#333';
            }
            salesChart.update();
        }
    });
    
    // Initial data load
    fetchData().then(data => {
        updateData(data);
        
        // Setup data refresh (every 5 minutes)
        setInterval(() => {
            fetchData().then(updateData);
        }, 5 * 60 * 1000);
    });
    
    // Load recent sales data
    fetchRecentSales().then(sales => {
        updateRecentSales(sales);
        
        // Setup data refresh (every 5 minutes)
        setInterval(() => {
            fetchRecentSales().then(updateRecentSales);
        }, 5 * 60 * 1000);
    });
});

// Example function to receive data from external sources (API, WebSocket, etc.)
function receiveDataUpdate(newData) {
    updateData(newData);
}

// Example function to receive recent sales updates
function receiveRecentSalesUpdate(sales) {
    updateRecentSales(sales);
}

// Listen for custom events to update data (example of how external code could trigger updates)
window.addEventListener('salesDataUpdate', function(e) {
    if (e.detail && e.detail.data) {
        receiveDataUpdate(e.detail.data);
    }
});

window.addEventListener('recentSalesUpdate', function(e) {
    if (e.detail && e.detail.sales) {
        receiveRecentSalesUpdate(e.detail.sales);
    }
});
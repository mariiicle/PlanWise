document.addEventListener('DOMContentLoaded', () => {
    // Initialize intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class and observe all animated elements
    const animatedElements = document.querySelectorAll('h1, p, button, img');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.glass-card, .feature-icon').forEach((el) => {
        el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        fadeObserver.observe(el);
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.floating').forEach(elem => {
            const speed = 0.5;
            elem.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Get all navigation items with dropdowns
    const navItems = document.querySelectorAll('.nav-item');
    
    // Add click event listeners to each nav item
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Get the dropdown associated with this nav item
            const dropdown = this.querySelector('.dropdown');
            
            // Hide all other dropdowns first
            document.querySelectorAll('.dropdown').forEach(drop => {
                if (drop !== dropdown) {
                    drop.classList.remove('show');
                }
            });
            
            // Toggle the current dropdown
            dropdown.classList.toggle('show');
            
            // Stop propagation to prevent document click from immediately closing
            e.stopPropagation();
        });
    });

    // Close all dropdowns when clicking elsewhere on the page
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
    
    
    const popupContent = {
        "About PlanWise": {
            title: "About PlanWise",
            content: "PlanWise is an innovative architectural planning tool designed specifically for both students and professionals. Founded in 2025, we're dedicated to simplifying the early stages of architectural design with intuitive digital tools.",
            icon: "✨",
            targetSection: null 
        },
        "How It Works": {
            title: "How It Works",
            content: "PlanWise uses an intuitive interface to guide you through the early design process. Customize own map, define project parameters, and use our tools to generate site analysis, zoning visualizations, matrix diagrams, and bubble diagrams in minutes.",
            icon: "🔄",
            targetSection: null 
        },
        "Success Stories": {
            title: "Success Stories",
            content: "Discover how architecture students and professionals have transformed their workflow with PlanWise. From academic projects to professional practice, see real examples of improved efficiency and design quality.",
            icon: "🏆",
            targetSection: null 
        },
        "Why PlanWise": {
            title: "Why PlanWise",
            content: "PlanWise stands out with its comprehensive yet simple approach to early architectural planning. Save up to 70% of time on initial planning, improve design decisions with data-driven insights, and communicate concepts more effectively.",
            icon: "💡",
            targetSection: null 
        },
        
        "Site Analysis": {
            title: "Site Analysis",
            content: "Analyze environmental factors, circulation, and context to inform better design decisions.",
            icon: "🔍",
            targetSection: "site-analysis-section" 
        },
        "Zoning & Regulations": {
            title: "Zoning & Regulations",
            content: "Visualize zoning laws, height restrictions, and building coverage requirements. Our database covers major cities and can be customized for your specific location to ensure compliance from the start.",
            icon: "📏",
            targetSection: "zoning-section" 
        },
        "Matrix Diagrams": {
            title: "Matrix Diagrams",
            content: "Define spatial relationships between different functions with automated matrix diagrams.",
            icon: "🔢",
            targetSection: "matrix-section" 
        },
        "Bubble Diagrams": {
            title: "Bubble Diagrams",
            content: "Visualize spatial organization and flow with easy-to-generate bubble diagrams.",
            icon: "⭕",
            targetSection: "bubble-section" 
        },
        "Vicinity Mapping": {
            title: "Vicinity Mapping",
            content: "Identify key surroundings, landmarks, and accessibility for better site planning.",
            icon: "🗺️",
            targetSection: "vicinity-section" 
        },
        "3D Massing Study": {
            title: "3D Massing Study",
            content: "Transform 2D site analysis into conceptual 3D models with volumetric studies.",
            icon: "🏙️",
            targetSection: "massing-section" 
        }
    };
    
    // Add IDs to all feature cards for targeting
    const featureCards = document.querySelectorAll('.glass-card');
    
    // Map titles to card elements
    const cardTitles = {
        "Site Analysis": "site-analysis-section",
        "Zoning & Regulations": "zoning-section",
        "Matrix Diagram": "matrix-section",
        "Bubble Diagram": "bubble-section",
        "Vicinity Mapping": "vicinity-section",
        "3D Massing Study": "massing-section"
    };
    
    // Assign IDs to feature cards based on their titles
    featureCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        if (titleElement) {
            const title = titleElement.textContent.trim();
            const sectionId = cardTitles[title];
            if (sectionId) {
                card.id = sectionId;
            }
        }
    });
    
    // Create overlay for popup
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);
    
    // Create popup container with adjusted positioning
    const popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.top = '20%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1000';
    popup.style.backgroundColor = 'rgba(20, 20, 40, 0.9)';
    popup.style.border = '1px solid rgba(138, 75, 240, 0.5)';
    popup.style.borderRadius = '16px';
    popup.style.padding = '30px';
    popup.style.width = '90%';
    popup.style.maxWidth = '500px';
    popup.style.maxHeight = '80vh';
    popup.style.overflow = 'auto';
    popup.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(123, 77, 255, 0.3)';
    popup.style.color = 'white';
    popup.style.fontSize = '16px';
    popup.style.lineHeight = '1.6';
    popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    popup.style.opacity = '0';
    document.body.appendChild(popup);
    
    // Variable to store the currently active target section
    let currentTargetSection = null;
    
    // Handle dropdown item clicks to show popup
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            const itemText = this.textContent.trim();
            const itemData = popupContent[itemText] || { title: itemText, content: "Information coming soon.", icon: "ℹ️" };
            
            // Store the target section ID for the Learn More button
            currentTargetSection = itemData.targetSection;
            
            // Set popup content with X button in top right
            popup.innerHTML = `
                <div style="position:relative;">
                    <button id="closePopup" style="position:absolute; top:-15px; right:-15px; background:rgba(138, 75, 240, 0.8); border:none; color:white; width:30px; height:30px; border-radius:50%; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.3);">×</button>
                    <div style="text-align:center; font-size:48px; margin-bottom:10px;">${itemData.icon}</div>
                    <h3 style="text-align:center; font-size:24px; font-weight:bold; margin-bottom:15px;">${itemData.title}</h3>
                    <p style="text-align:center; margin-bottom:20px;">${itemData.content}</p>
                    <div style="margin-top:25px; display:flex; justify-content:center;">
                        <button id="learnMoreBtn" class='purple-button' style='background-color:#8a4bf0; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;'>Learn More</button>
                    </div>
                </div>`;
            
            // Show overlay and popup with animation
            overlay.style.display = 'block';
            popup.style.display = 'block';
            
            // Force reflow to enable transition
            void popup.offsetWidth;
            
            // Trigger animation
            popup.style.opacity = '1';
            
            // Set up close functionality for X button
            const closeBtn = document.getElementById('closePopup');
            if (closeBtn) {
                closeBtn.addEventListener('click', closePopup);
            }
            
            // Set up Learn More button functionality
            const learnMoreBtn = document.getElementById('learnMoreBtn');
            if (learnMoreBtn) {
                learnMoreBtn.addEventListener('click', function() {
                    handleLearnMoreClick();
                });
            }
            
            overlay.onclick = closePopup;
            
            // Close dropdown after opening popup
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        });
    });
    
    // Function to handle Learn More button click
    function handleLearnMoreClick() {
        closePopup();
        
        // Check if we have a target section to navigate to
        if (currentTargetSection) {
            setTimeout(() => {
                const targetElement = document.getElementById(currentTargetSection);
                if (targetElement) {
                    // Scroll to the target element with smooth animation
                    targetElement.scrollIntoView({
                        behavior: 'smooth', 
                        block: 'center'
                    });
                    
                    // Add a highlight effect to the target card
                    targetElement.classList.add('highlight-card');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-card');
                    }, 1500);
                }
            }, 300); // Wait for popup to close before scrolling
        }
    }
    
    // Function to close popup with animation
    function closePopup() {
        popup.style.opacity = '0';
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }
    
    // Add escape key functionality to close popup
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.style.display === 'block') {
            closePopup();
        }
    });
    
    // Add CSS to handle the highlight effect
    const highlightStyle = document.createElement('style');
    highlightStyle.innerHTML = `
        .highlight-card {
            animation: pulse-border 1.5s ease;
            position: relative;
            z-index: 10;
            box-shadow: 0 0 30px rgba(138, 75, 240, 0.8) !important;
        }
        
        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 rgba(138, 75, 240, 0.4); }
            50% { box-shadow: 0 0 30px rgba(138, 75, 240, 0.8); }
            100% { box-shadow: 0 0 0px rgba(138, 75, 240, 0.4); }
        }
    `;
    document.head.appendChild(highlightStyle);
});
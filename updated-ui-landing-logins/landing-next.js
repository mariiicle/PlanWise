document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper sliders
    const tutorialSwiper = new Swiper('.tutorial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.tutorial-swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tutorial-swiper .swiper-button-next',
            prevEl: '.tutorial-swiper .swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
    });

    const teamSwiper = new Swiper('.team-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: '.team-swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.team-swiper .swiper-button-next',
            prevEl: '.team-swiper .swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        let clickedOnNavItem = false;
        navItems.forEach(item => {
            if (item.contains(event.target)) {
                clickedOnNavItem = true;
            }
        });
        
        if (!clickedOnNavItem) {
            navItems.forEach(item => {
                item.classList.remove('active');
                const dropdown = item.querySelector('.dropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        }
    });
    
    // Mobile menu button
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    if (mobileMenuButton) {
        const mobileMenu = document.querySelector('.md\\:hidden + .md\\:flex');
        
        mobileMenuButton.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }

    // Star rating system
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingText = document.querySelector('.rating-text');
    const ratingValue = document.getElementById('rating-value');
    
    if (stars.length > 0 && ratingText && ratingValue) {
        // Initialize stars to gray
        stars.forEach(star => {
            star.classList.add('text-gray-400');
            star.classList.remove('text-yellow-400');
        });
        
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                highlightStars(rating);
                updateRatingText(rating);
            });
            
            star.addEventListener('mouseout', function() {
                const selectedRating = ratingValue.value;
                highlightStars(selectedRating);
                updateRatingText(selectedRating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingValue.value = rating;
                highlightStars(rating);
                updateRatingText(rating);
            });
        });
    }
    
    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = star.getAttribute('data-rating');
            if (starRating <= rating) {
                star.classList.add('text-yellow-400');
                star.classList.remove('text-gray-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-400');
            }
        });
    }
    
    function updateRatingText(rating) {
        const texts = ['Click to rate', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        ratingText.textContent = rating > 0 ? texts[rating] : texts[0];
    }

    // Form validation and submission
    const contactForm = document.querySelector('#contact form');
    
    if (contactForm) {
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        const messageInput = document.getElementById('message');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError(emailInput);
            }
            
            // Validate name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                hideError(nameInput);
            }
            
            // Validate message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                hideError(messageInput);
            }
            
            if (isValid) {
                // Show success message
                showSuccessMessage(contactForm);
                // Reset form
                contactForm.reset();
                ratingValue.value = 0;
                highlightStars(0);
                updateRatingText(0);
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showError(input, message) {
        // Remove any existing error
        hideError(input);
        
        // Create error element
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm mt-1 error-message';
        errorElement.textContent = message;
        
        // Insert error after input
        input.parentNode.insertBefore(errorElement, input.nextSibling);
        
        // Add error styling to input
        input.classList.add('border-red-500');
        input.classList.remove('border-purple-600');
    }
    
    function hideError(input) {
        // Remove error message if it exists
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Remove error styling
        input.classList.remove('border-red-500');
        input.classList.add('border-purple-600');
    }
    
    function showSuccessMessage(form) {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'bg-green-500 text-white p-4 rounded-lg mt-4 success-message';
        successMessage.innerHTML = '<p class="font-bold">Thank you for your message!</p><p>We will get back to you as soon as possible.</p>';
        
        // Remove existing success message if any
        const existingMessage = form.parentNode.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add success message after form
        form.parentNode.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Newsletter form
    const newsletterForm = document.querySelector('#newsletter form');
    
    if (newsletterForm) {
        const newsletterInput = newsletterForm.querySelector('input[type="email"]');
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateEmail(newsletterInput.value)) {
                showToast('Please enter a valid email address');
                return;
            }
            
            // Show success toast
            showToast('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
    
    // Scroll animations
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('opacity-0', 'transform', 'translate-y-10', 'transition-all', 'duration-700');
        observer.observe(section);
    });

    // Hover animations for feature cards
    const featureCards = document.querySelectorAll('.hover-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('scale-105', 'shadow-xl');
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.classList.add('text-purple-400');
                icon.classList.add('scale-110');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('scale-105', 'shadow-xl');
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.classList.remove('text-purple-400');
                icon.classList.remove('scale-110');
            }
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


    // Add toast notification system
    function showToast(message) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container fixed bottom-4 right-4 z-50';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'bg-purple-600 text-white p-4 rounded-lg mb-3 shadow-lg transform translate-x-full opacity-0 transition-all duration-300';
        toast.textContent = message;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 10);
        
        // Hide and remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Add back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'fixed bottom-8 right-8 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-40 opacity-0 transition-opacity duration-300';
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.remove('opacity-0');
            backToTopBtn.classList.add('opacity-100');
        } else {
            backToTopBtn.classList.remove('opacity-100');
            backToTopBtn.classList.add('opacity-0');
        }
    });

    // Add dynamic FAQ accordion
    const faqItems = document.querySelectorAll('#faq h3');
    
    faqItems.forEach(item => {
        // Add classes for styling and interaction
        item.classList.add('cursor-pointer', 'flex', 'justify-between', 'items-center');
        
        // Only add icon if it doesn't exist already
        if (!item.querySelector('.fas.fa-chevron-down')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-down text-purple-400 transition-transform duration-300';
            item.appendChild(icon);
        }
        
        // Find the content that follows this heading
        const userInfo = item.nextElementSibling;
        const content = userInfo.nextElementSibling;
        
        // Initialize content visibility
        content.style.transition = 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out';
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        
        item.addEventListener('click', function() {
            // Toggle icon rotation
            const icon = this.querySelector('.fas.fa-chevron-down');
            if (icon) {
                icon.classList.toggle('transform');
                icon.classList.toggle('rotate-180');
            }
            
            // Toggle content visibility with animation
            if (content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.marginTop = '0';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.marginTop = '1rem';
            }
        });
    });

    // Add typing effect for headings
    function typeText(element, text, speed) {
        let i = 0;
        element.textContent = '';
        
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        
        typing();
    }

    const mainHeading = document.querySelector('#about h1');
    if (mainHeading) {
        const originalText = mainHeading.textContent;
        
        // Only run the typing animation once when the element becomes visible
        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        typeText(mainHeading, originalText, 50);
                    }, 500);
                    headingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        headingObserver.observe(mainHeading);
    }

    // Create and add particle animation to the background
    if (!document.querySelector('.particle-container')) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container fixed top-0 left-0 w-full h-full pointer-events-none z-0';
        document.body.prepend(particleContainer);
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 5 + 2;
            particle.className = 'absolute rounded-full bg-purple-400 opacity-20';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particleContainer.appendChild(particle);
        }
    }

    // Add keyframe animation for floating particles
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.innerHTML = `
            @keyframes float {
                0% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                }
                50% {
                    transform: translateY(-40px) translateX(-10px);
                }
                75% {
                    transform: translateY(-20px) translateX(-20px);
                }
                100% {
                    transform: translateY(0) translateX(0);
                }
            }
            .animate-fadeDown {
                animation: fadeDown 0.5s ease-out forwards;
            }
            @keyframes fadeDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            /* Add transition for FAQ content */
            #faq p {
                transition: opacity 0.3s, margin-top 0.3s;
            }
        `;
        document.head.appendChild(style);
    }
});
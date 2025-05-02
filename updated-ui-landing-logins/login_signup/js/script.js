document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelector(".forms"),
        pwShowHide = document.querySelectorAll(".eye-icon"),
        links = document.querySelectorAll(".link"),
        signupButton = document.querySelector(".signup button"), // Signup button
        loginButton = document.querySelector(".login button"), // Login button
        forgotPassword = document.querySelector(".forgot-pass"); // Forgot password link

    // Password show/hide functionality
    pwShowHide.forEach(eyeIcon => {
        eyeIcon.addEventListener("click", () => {
            let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

            pwFields.forEach(password => {
                if (password.type === "password") {
                    password.type = "text";  // Change to text to show password
                    eyeIcon.classList.replace("bx-hide", "bx-show"); // Change eye icon to show
                } else {
                    password.type = "password";  // Hide the password again
                    eyeIcon.classList.replace("bx-show", "bx-hide"); // Change eye icon to hide
                }
            });
        });
    });

    // Create custom alert styles
    const createCustomAlertStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .custom-alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .custom-alert {
                background: linear-gradient(to right bottom, #1e3a8a, #1e40af);
                color: white;
                border-radius: 8px;
                padding: 20px;
                max-width: 400px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                position: relative;
                border-left: 6px solid #eab308;
            }
            
            .custom-alert-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #fbbf24;
            }
            
            .custom-alert-content {
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .custom-alert-button {
                background-color: #eab308;
                color: #1e3a8a;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .custom-alert-button:hover {
                background-color: #fbbf24;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    };

    // Create and show custom alert
    const showCustomAlert = (title, message) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        
        // Create alert box
        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        
        // Create title
        const alertTitle = document.createElement('div');
        alertTitle.className = 'custom-alert-title';
        alertTitle.textContent = title;
        
        // Create content
        const alertContent = document.createElement('div');
        alertContent.className = 'custom-alert-content';
        alertContent.textContent = message;
        
        // Create button
        const alertButton = document.createElement('button');
        alertButton.className = 'custom-alert-button';
        alertButton.textContent = 'OK';
        alertButton.onclick = () => {
            document.body.removeChild(overlay);
        };
        
        // Assemble alert box
        alertBox.appendChild(alertTitle);
        alertBox.appendChild(alertContent);
        alertBox.appendChild(alertButton);
        overlay.appendChild(alertBox);
        
        // Add to document
        document.body.appendChild(overlay);
    };

    // Add custom alert styles to the document
    createCustomAlertStyles();

    // Handling forgot password link
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        showCustomAlert(
            "Password Reset Required", 
            "Please contact the admin at admin@planwise.com to reset your password. Our support team will assist you with your account recovery."
        );
    });

    // Handling the login button click
    loginButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        // Add form validation here if needed

        // After login, redirect to another page (or dashboard)
        window.location.href = "";
    });
});
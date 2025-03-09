document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelector(".forms"),
        pwShowHide = document.querySelectorAll(".eye-icon"),
        links = document.querySelectorAll(".link"),
        signupButton = document.querySelector(".signup button"), // Signup button
        loginButton = document.querySelector(".login button"); // Login button

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

    // Switch between login and signup forms
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault(); // Prevent the default link behavior
            forms.classList.toggle("show-signup"); // Toggle the class to show signup or login form
        });
    });

    // Handling the signup button click
    signupButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        // Add form validation here if needed

        // After signup, redirect to another page (or homepage)
        window.location.href = "";
    });

    // Handling the login button click
    loginButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        // Add form validation here if needed

        // After login, redirect to another page (or dashboard)
        window.location.href = "";
    });
});

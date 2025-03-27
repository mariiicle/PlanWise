import { auth } from "./firebaseauth.js"; // Import Firebase auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener("DOMContentLoaded", function () {
    try {
        const forms = document.querySelector(".forms"),
            pwShowHide = document.querySelectorAll(".eye-icon"),
            links = document.querySelectorAll(".link"),
            signupButton = document.querySelector(".signup-btn"),
            loginButton = document.querySelector(".login-btn"),
            signupEmail = document.querySelector(".signup-email"),
            signupPassword = document.querySelector(".signup-password"),
            confirmPassword = document.querySelector(".confirm-password"),
            loginEmail = document.querySelector(".login-email"),
            loginPassword = document.querySelector(".login-password");

        // Check if elements exist before using them
        if (!signupEmail || !signupPassword || !confirmPassword || !loginEmail || !loginPassword) {
            console.error("One or more input fields are missing from the HTML.");
            return;
        }

        // Show/hide password functionality
        pwShowHide.forEach(eyeIcon => {
            try {
                eyeIcon.addEventListener("click", () => {
                    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll("input[type='password']");
                    pwFields.forEach(password => {
                        if (password.type === "password") {
                            password.type = "text";
                            eyeIcon.classList.replace("bx-hide", "bx-show");
                        } else {
                            password.type = "password";
                            eyeIcon.classList.replace("bx-show", "bx-hide");
                        }
                    });
                });
            } catch (error) {
                console.error("Error toggling password visibility:", error);
            }
        });

        // Toggle between signup and login forms
        links.forEach(link => {
            try {
                link.addEventListener("click", e => {
                    e.preventDefault();
                    forms.classList.toggle("show-signup");
                });
            } catch (error) {
                console.error("Error toggling form view:", error);
            }
        });

        // Signup - Firebase Authentication
        signupButton.addEventListener('click', async (e) => {
            try {
                e.preventDefault();

                const emailValue = signupEmail.value.trim();
                const passwordValue = signupPassword.value.trim();
                const confirmPasswordValue = confirmPassword.value.trim();

                if (!emailValue || !passwordValue || !confirmPasswordValue) {
                    alert("Please fill in all fields.");
                    return;
                }

                if (passwordValue !== confirmPasswordValue) {
                    alert("Passwords do not match.");
                    return;
                }

                // Firebase Signup
                const userCredential = await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
                alert("Signup successful! Please log in.");
                console.log("User signed up:", userCredential.user);
                forms.classList.remove("show-signup"); // Switch to login form
            } catch (error) {
                console.error("Error during signup:", error);
                alert(getFirebaseErrorMessage(error.code));
            }
        });

        // Login - Firebase Authentication
        loginButton.addEventListener('click', async (e) => {
            try {
                e.preventDefault();

                const emailValue = loginEmail.value.trim();
                const passwordValue = loginPassword.value.trim();

                if (!emailValue || !passwordValue) {
                    alert("Please enter both email and password.");
                    return;
                }

                // Firebase Login
                const userCredential = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
                alert("Login successful!");
                console.log("User logged in:", userCredential.user);

                // Redirect user after successful login
                window.location.href = "homepage.html";
            } catch (error) {
                console.error("Error during login:", error);
                alert(getFirebaseErrorMessage(error.code));
            }
        });

    } catch (error) {
        console.error("Error initializing script:", error);
    }
});

// Function to handle Firebase error messages
function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        "auth/email-already-in-use": "This email is already registered. Please log in.",
        "auth/invalid-email": "Invalid email format. Please enter a valid email.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/user-not-found": "No user found with this email. Please sign up first.",
        "auth/network-request-failed": "Network error. Please check your connection.",
    };
    return errorMessages[errorCode] || "An unexpected error occurred. Please try again.";
}

// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firestore Database

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtkMkT-aPdu5K6DNKIl9KRR-ZxwzHN9Ck",
  authDomain: "planwise-4812d.firebaseapp.com",
  projectId: "planwise-4812d",
  storageBucket: "planwise-4812d.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "1082575837539",
  appId: "1:1082575837539:web:50bc2cf0708b1edfd45b56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore Database

// Export Firebase instances for use in other files
export { auth, db };

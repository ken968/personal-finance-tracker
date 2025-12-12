// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
// Import Firebase SDK v9+ (Modular Syntax)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase Configuration Object
// IMPORTANT: Replace these placeholder values with your actual Firebase project credentials
// You can find these values in your Firebase Console:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Select your project
// 3. Go to Project Settings (gear icon)
// 4. Scroll down to "Your apps" section
// 5. Click on the web app icon (</>)
// 6. Copy the configuration object

const firebaseConfig = {
    apiKey: "AIzaSyAdEFtL16_llO9ymMMbh-ZAGVsvdgVk_cc",
    authDomain: "personal-finance-tracker-f603e.firebaseapp.com",
    projectId: "personal-finance-tracker-f603e",
    storageBucket: "personal-finance-tracker-f603e.firebasestorage.app",
    messagingSenderId: "371003514306",
    appId: "1:371003514306:web:21987587fec1a9d266ca5b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export for use in app.js
export { db };

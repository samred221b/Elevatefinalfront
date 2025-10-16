// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9pmz7avHgrrQcQRng2qF9BcprCx0_PMQ",
  authDomain: "smart-home-controller-4c2ab.firebaseapp.com",
  projectId: "smart-home-controller-4c2ab",
  storageBucket: "smart-home-controller-4c2ab.firebasestorage.app",
  messagingSenderId: "344614900237",
  appId: "1:344614900237:web:776880d621e1610119bb44",
  measurementId: "G-TC89RKKJK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

// Debug Firebase initialization
console.log('🔥 Firebase initialized successfully');
console.log('🔐 Auth domain:', firebaseConfig.authDomain);
console.log('📱 Project ID:', firebaseConfig.projectId);

export default app;
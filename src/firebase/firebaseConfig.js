// Import Firebase core and authentication
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration object (replace with your actual config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyC2xuRMDFCU5Gm9nF8kex-877PX_Ba5R60",
  authDomain: "productivityapp-185b9.firebaseapp.com",
  projectId: "productivityapp-185b9",
  storageBucket: "productivityapp-185b9.firebasestorage.app",
  messagingSenderId: "460272800253",
  appId: "1:460272800253:web:cba2ada7f6dff09a81c994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

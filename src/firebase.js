// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwSAoP7gkdzWhiyYC269gAUJRAuo-YzzY",
  authDomain: "login-signup-db067.firebaseapp.com",
  projectId: "login-signup-db067",
  storageBucket: "login-signup-db067.firebasestorage.app",
  messagingSenderId: "829397008694",
  appId: "1:829397008694:web:91b241001e19f57103b397",
  measurementId: "G-DR13XV5HN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
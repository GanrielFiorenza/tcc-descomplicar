import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDonCvvAdNVQPUdhDk58wFZwLefRQXy6II",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "tcc-descomplicar.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "tcc-descomplicar",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "tcc-descomplicar.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1092993024251",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:1092993024251:web:61aa5e3c714a8052ed305e",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XKN5EB680Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX_BcvIqZL-7zoc1lN0Lc9Mw9fKQFs4DI",
  authDomain: "interntrack-5fae4.firebaseapp.com",
  projectId: "interntrack-5fae4",
  storageBucket: "interntrack-5fae4.firebasestorage.app",
  messagingSenderId: "271865928346",
  appId: "1:271865928346:web:b71f2d11c4538c2d54dd23",
  measurementId: "G-HYYZM0MLCG",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

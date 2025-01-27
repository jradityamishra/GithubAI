// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgoGS0tN6ip70Eb-CnDA2vjhsEYHtnUFo",
  authDomain: "chatopenai-98b11.firebaseapp.com",
  projectId: "chatopenai-98b11",
  storageBucket: "chatopenai-98b11.firebasestorage.app",
  messagingSenderId: "421630148291",
  appId: "1:421630148291:web:978a049dfd3a0f0984ec76"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

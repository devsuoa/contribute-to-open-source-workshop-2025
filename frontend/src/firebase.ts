// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "devs-contest-platform.firebaseapp.com",
  projectId: "devs-contest-platform",
  storageBucket: "devs-contest-platform.firebasestorage.app",
  messagingSenderId: "1088513742100",
  appId: "1:1088513742100:web:b926d3aac64d028de61e01",
};

// Initialise Firebase
export const app = initializeApp(firebaseConfig);

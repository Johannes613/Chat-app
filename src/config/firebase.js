import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9HqrHxRIJ8Lvddx413T5R_sBjaS4-870",
  authDomain: "chat-app-8928c.firebaseapp.com",
  projectId: "chat-app-8928c",
  storageBucket: "chat-app-8928c.firebasestorage.app",
  messagingSenderId: "585896329329",
  appId: "1:585896329329:web:584ff9c5d3def1f8e29bd0",
  measurementId: "G-CWYQ3GYTV0",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "63c944807ffcbd58baea7b8a2a0f6be32a338504",
  authDomain: "peerbetapp.firebaseapp.com",
  projectId: "peerbetapp",
  storageBucket: "peerbetapp.firebasestorage.app",
  messagingSenderId: "31014091482",
  appId: "1:31014091482:web:9680da3dc2f30bd46383e3",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

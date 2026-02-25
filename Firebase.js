// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD6wcUqwhm9SLqac_3B1KYdY5aKCXdVq_w",
  authDomain: "peerbetapp-test.firebaseapp.com",
  projectId: "peerbetapp-test",
  storageBucket: "peerbetapp-test.firebasestorage.app",
  messagingSenderId: "393525097118",
  appId: "1:31014091482:web:9680da3dc2f30bd46383e3",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

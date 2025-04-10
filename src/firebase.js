import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAz9t2E105B51RcrR4lHHA8aEt9qkqZMeQ",
  authDomain: "fundyapp-9b344.firebaseapp.com",
  projectId: "fundyapp-9b344",
  storageBucket: "fundyapp-9b344.firebasestorage.app",
  messagingSenderId: "748612428777",
  appId: "1:748612428777:web:cae9ee44fca7b34b4d2178",
  measurementId: "G-RVCXZ8N8K0"
};

// Initialize Firebase
console.log('Initialisation de Firebase...');
const app = initializeApp(firebaseConfig);
console.log('Firebase initialisé avec succès');

const db = getFirestore(app);
console.log('Firestore initialisé avec succès');

const analytics = getAnalytics(app);
console.log('Analytics initialisé avec succès');

export { db, analytics }; 
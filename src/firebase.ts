import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBmuEsBK9hyjE-DgpRxbvwt1ttn0lTbpnU",
  authDomain: "rera-quiz-prep.firebaseapp.com",
  projectId: "rera-quiz-prep",
  storageBucket: "rera-quiz-prep.firebasestorage.app",
  messagingSenderId: "808998406805",
  appId: "1:808998406805:web:4399455b329c1376c7a99c",
  measurementId: "G-VB8DW8V734"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
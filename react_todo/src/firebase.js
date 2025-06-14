
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCF0z3hf8znEkzs56JJoSC-f8XGTaHFuw8",
  authDomain: "taskly-to-do-b9706.firebaseapp.com",
  projectId: "taskly-to-do-b9706",
  storageBucket: "taskly-to-do-b9706.firebasestorage.app",
  messagingSenderId: "818001264371",
  appId: "1:818001264371:web:bd3eaef6397f493a400186"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

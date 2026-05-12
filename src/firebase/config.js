import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCHZ73bOTZ37mNc2_k1ZQ9IV7PhIkfzWLk",
  authDomain: "teamtaskforce-108.firebaseapp.com",
  projectId: "teamtaskforce-108",
  storageBucket: "teamtaskforce-108.firebasestorage.app",
  messagingSenderId: "525889892689",
  appId: "1:525889892689:web:48f36e31b407d91222a370",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
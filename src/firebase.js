import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRESTORE_KEY,
  authDomain: "wabs-e49c4.firebaseapp.com",
  projectId: "wabs-e49c4",
  storageBucket: "wabs-e49c4.appspot.com",
  messagingSenderId: "548572676270",
  appId: process.env.REACT_APP_FIRESTORE_ID,
  measurementId: "G-ZZ7PP6NHT5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const analytics = getAnalytics(app);
export const fdb = getFirestore(app)

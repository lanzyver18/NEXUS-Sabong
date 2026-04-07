import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBvOw8HrMhZD0aYSHqFdE196ZITdYBU3Q",
  authDomain: "nexus-sabong.firebaseapp.com",
  projectId: "nexus-sabong",
  storageBucket: "nexus-sabong.firebasestorage.app",
  messagingSenderId: "421723311",
  appId: "1:421723311:web:1780f179e7c2a7cc0e285a",
  measurementId: "G-W2B0R09D8L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

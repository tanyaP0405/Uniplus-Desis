import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNlwV8JayiCnOIceM2olchvIqyvMlL-vY",
  authDomain: "eduform-ffd1d.firebaseapp.com",
  databaseURL: "https://eduform-ffd1d-default-rtdb.firebaseio.com",
  projectId: "eduform-ffd1d",
  storageBucket: "eduform-ffd1d.appspot.com",
  messagingSenderId: "871559454241",
  appId: "1:871559454241:web:72242f4fb12dae57ad4d60",
  measurementId: "G-3S0LH0MSZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// import statements needed 
// import { auth, db, storage } from "../lib/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { ref, uploadString } from "firebase/storage";
// import { useState } from "react";

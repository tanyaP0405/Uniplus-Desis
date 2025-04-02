import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to fetch items based on type (all, lost, found)
export const getItems = async (type) => {
  const itemsRef = collection(db, "items");
  let q = itemsRef;
  if (type !== "all") {
    q = query(itemsRef, where("type", "==", type));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to upload media and return its URL
export const uploadMedia = async (file) => {
  const storageRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Function to add a new lost or found item
export const addItem = async (itemData) => {
  const itemsRef = collection(db, "items");
  await addDoc(itemsRef, itemData);
};

// Function to delete an item
export const deleteItem = async (id) => {
  await deleteDoc(doc(db, "items", id));
};
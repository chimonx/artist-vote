import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDsYvmkZb-rZ76b12IGeKBmfG5Ie3mwbWE",
    authDomain: "artist-3bad9.firebaseapp.com",
    projectId: "artist-3bad9",
    storageBucket: "artist-3bad9.firebasestorage.app",
    messagingSenderId: "1026774393767",
    appId: "1:1026774393767:web:ebefb54eae166bb0c84c82",
    measurementId: "G-EC84T3LLQC"
  };  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

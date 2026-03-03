// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0XpUd43vuAp5mZ1ydE0QOHope73LnXmE",
  authDomain: "block-clan.firebaseapp.com",
  projectId: "block-clan",
  storageBucket: "block-clan.firebasestorage.app",
  messagingSenderId: "928939791712",
  appId: "1:928939791712:web:3d541724bf5d251d3dfa05",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

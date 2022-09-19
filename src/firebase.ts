import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDeiw2qf762s7gA8eE_o0_g5sW584-mvn4",
  authDomain: "luk3v-yesorno.firebaseapp.com",
  projectId: "luk3v-yesorno",
  storageBucket: "luk3v-yesorno.appspot.com",
  messagingSenderId: "906248188823",
  appId: "1:906248188823:web:db45ce53fcda9e2a8b8ad2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);

export {auth, db, storage};
export default app;
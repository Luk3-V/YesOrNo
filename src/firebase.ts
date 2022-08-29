import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB4oIXVD6QjlJyldh62v6JuYoVGMaIMQi4",
    authDomain: "luk3v-pollify.firebaseapp.com",
    projectId: "luk3v-pollify",
    storageBucket: "luk3v-pollify.appspot.com",
    messagingSenderId: "272957438934",
    appId: "1:272957438934:web:cdc54ab6aba8f156ab8277"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);
/*onAuthStateChanged(auth, (user) => {
    console.log('user state changed:', user);
});*/

export {auth, db, storage};
export default app;
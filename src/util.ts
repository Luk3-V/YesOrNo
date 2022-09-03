import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { db, storage } from "./firebase";
import { getProfile, UserState } from "./store/UserSlice";

export async function checkNameTaken(name: string, uid: string, setIsValid: Function, setLoading: Function) {
    setLoading(true);
    if (name.length >= 3) {
        const docRef = doc(db, "usernames", name);
        const docSnap = await getDoc(docRef);
        console.log('Firestore read executed!', !docSnap.exists(), docSnap.data()?.uid === uid);

        setIsValid(!docSnap.exists() || docSnap.data()?.uid === uid);
    }
    setLoading(false);
}

export async function uploadProfileImg(file: File, uid: string, setLoading: Function) {
    const fileRef = ref(storage, uid+'.png');
    setLoading(true);
    const fileSnap = await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    setLoading(false);

    return fileURL;
}

export async function getUserID(username: string) {
    const usernameRef = doc(db, "usernames", username);
    const result = await getDoc(usernameRef)
        .then((doc) => {
            return doc.data()?.uid;
        })
        .catch(error => {
            console.log(error);
            return null;
        });
    return result;
}

export async function getUserProfile(uid: string) {
    const userRef = doc(db, "users", uid);
    const result = await getDoc(userRef)
      .then((doc) => {
          return doc.data();
      })
      .catch(error => {
          console.log(error);
          return null;
      });
    return result;
}

export async function createPoll(question: string, image: string | null, profile: UserState["profile"]) {
    const pollData = {
        question: question,
        image: image,
        uid: profile.uid,
        name: profile.name,
        profileImage: profile.image,
        createdAt: serverTimestamp(),
        yesCount: 0,
        noCount: 0
    } 
    
    const result = await addDoc(collection(db, "polls"), pollData)
        .then((doc) => {
            return doc.id;
        })
        .catch((error) => {
            console.log(error);
            return null;
        }); 
    return result;
}
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

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
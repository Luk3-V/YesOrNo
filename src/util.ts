import { addDoc, collection, deleteDoc, doc, documentId, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { db, storage } from "./firebase";
import { PollState } from "./store/PollsSlice";
import { getProfile, UserState } from "./store/UserSlice";

export async function checkNameTaken(name: string, uid: string, setIsValid: Function, setLoading: Function) {
    setLoading(true);
    if (name.length >= 3) {
        const docRef = doc(db, "usernames", name);
        const docSnap = await getDoc(docRef);

        setIsValid(!docSnap.exists() || docSnap.data()?.uid === uid);
    }
    setLoading(false);
}

export async function uploadImg(file: File, name: string) {
    const fileRef = ref(storage, name);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);

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
          return doc.data() as UserState["profile"];
      })
      .catch(error => {
          console.log(error);
          return null;
      });
    return result;
}

export async function createPoll(question: string, image: File | null, profile: UserState["profile"]) {
    const pollData = {
        question: question,
        image: null,
        uid: profile.uid,
        name: profile.name,
        profileImage: profile.image,
        createdAt: new Date().toISOString(),
        yesVotes: [],
        noVotes: []
    } 
    
    const result = await addDoc(collection(db, "polls"), pollData)
        .then(async (poll) => {
            if(image) {
                const imageURL = image ? await uploadImg(image as File, poll.id) : null;
                await updateDoc(doc(db, "polls", poll.id), { image: imageURL })
            }

            return poll.id;
        })
        .catch((error) => {
            console.log(error);
            return null;
        }); 
    return result;
}

export async function getUserPolls(polls: Array<string>) {
    const pollsQuery = query(collection(db, "polls"), where(documentId(), 'in', polls), limit(10)); 
    const result = await getDocs(pollsQuery)
        .then((docs) => {
            let polls:Array<any> = [];
            docs.forEach((doc) => polls.push({
                ...doc.data(),
                pollID: doc.id
            }));
            return polls.sort((p1, p2) => {
                return Date.parse(p1.createdAt) < Date.parse(p2.createdAt) ? 1 : -1;
            });
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
    return result;
}


// ------- GENERAL ---------

export function percentage(value: number, total: number) {
    if(total === 0)
        return 0;
    return Math.round((value / total) * 100) ;
}
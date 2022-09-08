import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, arrayRemove, collection, deleteDoc, doc, FieldValue, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { PollState } from "./PollsSlice";


export const loadAllPolls = createAsyncThunk('polls/loadAllPolls', async (_, { rejectWithValue }) => {
    const pollsQuery = query(collection(db, "polls"), orderBy("createdAt", "desc"), limit(10));
    const result = await getDocs(pollsQuery)
        .then((docs) => {
            let polls:Array<any> = [];
            docs.forEach((doc) => polls.push({
                ...doc.data(),
                pollID: doc.id
            }));
            return polls;
        })
        .catch((error) => {
            console.log(error);
            return rejectWithValue(error.message);
        });
    return result;
});

export const deletePoll = createAsyncThunk('polls/deletePoll', async (pollID: string, { rejectWithValue }) => {
    console.log("RUN", pollID);
    const result = await getDoc(doc(db, "polls", pollID))
        .then(async (doc) => {
            return await deletePollAndVotes(doc.data() as PollState, rejectWithValue);
        })
        .catch((error) => {
            console.log(error);
            return rejectWithValue(error.message);
        }); 
    return result;
});
// get last doc value

export const addPollVote = createAsyncThunk('polls/addPollVote', async ({vote, pollData, uid}: {vote: string, pollData: PollState, uid: string}, { rejectWithValue }) => {
    const newPollData = { // includes pollID
        ...pollData,
        yesVotes: vote === 'yes' ? [uid, ...pollData.yesVotes] : pollData.yesVotes,
        noVotes: vote === 'no' ? [uid, ...pollData.noVotes] : pollData.noVotes
    }

    const result = await setDoc(doc(db, "polls", pollData.pollID), newPollData)
        .then(() => {
            return newPollData;
        })
        .catch((error) => {
            console.log(error);
            return rejectWithValue(error.message);
        });
    return result;
});


// --------------------------------------------

async function deletePollAndVotes(pollData: PollState, rejectWithValue: Function) {
    const batch = writeBatch(db);
    batch.delete(doc(db, "polls", pollData.pollID));
    pollData.yesVotes.forEach((uid) => {
        const userRef = doc(db, "users", uid);
        batch.update(userRef, {
            yesVotes: arrayRemove(pollData.pollID)
        });
        console.log("found yes vote", uid);
    });
    pollData.noVotes.forEach((uid) => {
        const userRef = doc(db, "users", uid);
        batch.update(userRef, {
            noVotes: arrayRemove(pollData.pollID)
        });
        console.log("found no vote", uid);
    });
    const result = await batch.commit()
        .then(() => {
            return pollData.pollID;
        })
        .catch(error => {
            console.log(error);
            return rejectWithValue("error.message");
        });
    return result;
}
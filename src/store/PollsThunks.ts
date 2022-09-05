import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
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
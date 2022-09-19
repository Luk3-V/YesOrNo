import { createAsyncThunk } from "@reduxjs/toolkit";
import { arrayRemove, collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where, writeBatch } from "firebase/firestore";
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

export const loadFollowingPolls = createAsyncThunk('polls/loadFollowingPolls', async (followers: Array<string>, { rejectWithValue }) => {
    console.log('loading');
    const pollsQuery = query(collection(db, "polls"), orderBy("createdAt", "desc"), where('uid', 'in', followers), limit(10)); // inefficient at large amount of posts to query
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
            const poll: any = {
                ...doc.data(),
                pollID: pollID
            }
            return await deletePollAndVotes(poll, rejectWithValue);
        })
        .catch((error) => {
            console.log(error);
            return rejectWithValue(error.message);
        }); 
    return result;
});
// get last doc value

export const addPollVote = createAsyncThunk('polls/addPollVote', async ({vote, pollData, uid}: {vote: string, pollData: PollState, uid: string}, { rejectWithValue }) => {
    const updateData = {
        yesVotes: vote === 'yes' ? [uid, ...pollData.yesVotes] : pollData.yesVotes,
        noVotes: vote === 'no' ? [uid, ...pollData.noVotes] : pollData.noVotes
    }
    
    const result = await updateDoc(doc(db, "polls", pollData.pollID), updateData)
        .then(() => {
            const newPollData = {
                ...pollData,
                ...updateData
            }
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
    console.log('delete', pollData)
    const batch = writeBatch(db);
    batch.delete(doc(db, "polls", pollData.pollID));
    pollData.yesVotes.forEach((uid: string) => {
        const userRef = doc(db, "users", uid);
        batch.update(userRef, {
            yesVotes: arrayRemove(pollData.pollID)
        });
        console.log("found yes vote", uid);
    });
    pollData.noVotes.forEach((uid: string) => {
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
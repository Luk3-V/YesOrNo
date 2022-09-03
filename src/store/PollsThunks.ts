import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


export const loadAllPolls = createAsyncThunk('polls/loadAllPolls', async (_, { rejectWithValue }) => {
    const pollsQuery = query(collection(db, "polls"), orderBy("createdAt", "desc"), limit(10));
    const result = await getDocs(pollsQuery)
        .then((docs) => {
            let polls:Array<any> = [];
            docs.forEach((doc) => polls.push({
                ...doc.data(),
                createdAt: doc.data().createdAt.toString()
            }));
            return polls;
        })
        .catch((error) => {
            console.log(error);
            return rejectWithValue(error.message);
        });
    return result;
});
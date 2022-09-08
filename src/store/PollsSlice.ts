import { createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
import { addPollVote, deletePoll, loadAllPolls } from "./PollsThunks";

export interface PollState {
    pollID: string,
    createdAt: string,
    uid: string,
    name: string,
    profileImage: string,
    question: string,
    image: string | null,
    yesVotes: Array<string>
    noVotes: Array<string>
}

const initialState:{all: Array<PollState>, following: Array<PollState>} = {
    all: [],
    following: []
};

const pollsSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(loadAllPolls.fulfilled, (state, action) => {
            state.all = action.payload;
        })
        .addCase(deletePoll.fulfilled, (state, action) => {
            const newPolls = state.all.filter((x) => x.pollID !== action.payload);
            state.all = newPolls;
            console.log("DELETED");
        })
        .addCase(addPollVote.fulfilled, (state, action) => {
            const i = state.all.findIndex((x) => x.pollID === action.payload.pollID);
            state.all[i] = action.payload;
            console.log("VOTED");
        })
    }
});

export { loadAllPolls, deletePoll, addPollVote };
export const getAllPolls = (state: any) => state.polls.all;
export const getFollowingPolls = (state: any) => state.polls.following;
export default pollsSlice.reducer;
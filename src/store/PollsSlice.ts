import { createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
import { loadAllPolls } from "./PollsThunks";

export interface PollState {
    createdAt: string,
    uid: string,
    name: string,
    profileImage: string,
    question: string,
    image: string | null,
    yesCount: number,
    noCount: number
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
    }
});

export { loadAllPolls };
export const getAllPolls = (state: any) => state.polls.all;
export const getFollowingPolls = (state: any) => state.polls.following;
export default pollsSlice.reducer;
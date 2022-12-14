import { createSlice } from '@reduxjs/toolkit'
import { updateUserProfile, userSignIn, userSignOut, userSignUp, googleSignIn, loadUserProfile, addUserPollID, deleteUserPollID, addUserVote, addUserFollow, deleteUserFollow } from './UserThunks'

export interface UserState {
  profile: {
    uid: string | null,
    createdAt: string | null,
    name: string | null | undefined,
    email: string | null,
    bio: string | null,
    image: string | undefined,
    followers: Array<string>,
    following: Array<string>,
    polls: Array<string>,
    yesVotes: Array<string>
    noVotes: Array<string>
  },
  status: 'idle' | 'loading' | 'success' | 'fail'
  error: string | undefined,
  isNewUser: boolean
}

export const initialState: UserState = {
  profile: {
    uid: null,
    createdAt: null,
    name: 'guest',
    email: null,
    bio: null,
    image: 'https://firebasestorage.googleapis.com/v0/b/luk3v-yesorno.appspot.com/o/default.png?alt=media&token=68702d39-c667-45a4-b57a-3cad85f5b87d',
    followers: [],
    following: [],
    polls: [],
    yesVotes: [],
    noVotes: []
  },
  status: 'idle',
  error: undefined,
  isNewUser: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.status = 'idle';
      state.error = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(userSignUp.pending, (state, action) => {
      state.status = 'loading';
      console.log('loading');
    })
    .addCase(userSignUp.fulfilled, (state, action) => {
      state.status = 'success';
      state.error = undefined;
      state.profile = action.payload.profile;
      state.isNewUser = action.payload.isNewUser;
    })
    .addCase(userSignUp.rejected, (state, action) => {
      state.status = 'fail';
      state.error = action.payload as string;
    })
    .addCase(userSignIn.pending, (state, action) => {
      state.status = 'loading';
    })
    .addCase(userSignIn.fulfilled, (state, action) => {
      state.status = 'success';
      state.error = undefined;
      state.profile = action.payload as typeof initialState.profile;
    })
    .addCase(userSignIn.rejected, (state, action) => {
      state.status = 'fail';
      state.error = action.payload as string;
    })
    .addCase(userSignOut.fulfilled, (state, action) => {
      state.profile = {...initialState.profile};
      state.status = 'idle';
      state.error = undefined;
    })
    .addCase(googleSignIn.pending, (state, action) => {
      state.status = 'loading';
    })
    .addCase(googleSignIn.fulfilled, (state, action) => {
      state.status = 'success';
      state.error = undefined;
      state.profile = action.payload.profile;
      state.isNewUser = action.payload.isNewUser;
    })
    .addCase(googleSignIn.rejected, (state, action) => {
      state.status = 'fail';
      state.error = action.payload as string;
    })
    .addCase(updateUserProfile.fulfilled, (state, action) => {
      state.profile.name = action.payload.name;
      state.profile.bio = action.payload.bio;
      state.profile.image = action.payload.image;
    })
    .addCase(loadUserProfile.pending, (state, action) => {
      state.status = 'loading';
    })
    .addCase(loadUserProfile.fulfilled, (state, action) => {
      state.status = 'success';
      state.error = undefined;
      state.profile = action.payload as typeof initialState.profile;
    })
    .addCase(loadUserProfile.rejected, (state, action) => {
      state.status = 'fail';
      state.error = action.payload as string;
    })
    .addCase(addUserPollID.fulfilled, (state, action) => {
      state.profile.polls.push(action.payload);
      console.log("POLL ID ADDED");
    })
    .addCase(deleteUserPollID.fulfilled, (state, action) => {
      state.profile.polls = state.profile.polls.filter((x) => x !== action.payload);
      console.log("POLL ID DELETED");
    })
    .addCase(addUserVote.fulfilled, (state, action) => {
      state.profile.yesVotes = action.payload.yesVotes;
      state.profile.noVotes = action.payload.noVotes;
      console.log("VOTE ID ADDED");
    })
    .addCase(addUserFollow.fulfilled, (state, action) => {
      state.profile.following.push(action.payload);
      console.log("FOLLOW ADDED");
    })
    .addCase(deleteUserFollow.fulfilled, (state, action) => {
      state.profile.following = state.profile.following.filter((x) => x !== action.payload);
      console.log("FOLLOW DELETED");
    })
  }
})

// Action creators are generated for each case reducer function
export { updateUserProfile, loadUserProfile, userSignIn, userSignOut, userSignUp, googleSignIn, addUserPollID, deleteUserPollID, addUserVote, addUserFollow, deleteUserFollow };
export const { resetError } = userSlice.actions;
export const getProfile = (state: any) => state.user.profile;
export const getStatus = (state: any) => state.user.status;
export const getError = (state: any) => state.user.error;
export const getIsNewUser = (state: any) => state.user.isNewUser;
export default userSlice.reducer;
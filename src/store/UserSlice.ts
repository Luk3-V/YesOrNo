import { createSlice } from '@reduxjs/toolkit'
import { updateUserProfile, userSignIn, userSignOut, userSignUp, googleSignIn } from './UserThunks'

export interface UserState {
  profile: {
    uid: string | null,
    name: string | null | undefined,
    email: string | null,
    bio: string | null,
    image: string | null,
    polls: number,
    followers: number,
    following: number
  },
  status: 'idle' | 'loading' | 'success' | 'fail'
  error: string | undefined,
  isNewUser: boolean
}

export const initialState: UserState = {
  profile: {
    uid: null,
    name: 'guest',
    email: null,
    bio: null,
    image: 'https://st3.depositphotos.com/13402246/34252/v/600/depositphotos_342529278-stock-illustration-hand-drawn-basic-silhouette-avatar.jpg',
    polls: 0,
    followers: 0,
    following: 0
  },
  status: 'idle',
  error: undefined,
  isNewUser: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.profile.name = action.payload.name;
    },
    resetError: (state) => {
      state.status = 'idle';
      state.error = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(userSignUp.pending, (state, action) => {
      state.status = 'loading';
    })
    .addCase(userSignUp.fulfilled, (state, action) => {
      state.status = 'success';
      state.error = undefined;
      state.profile = action.payload;
      state.isNewUser = true;
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
      state.profile = action.payload;
    })
  }
})

// Action creators are generated for each case reducer function
export { updateUserProfile, userSignIn, userSignOut, userSignUp, googleSignIn };
export const { setName, resetError } = userSlice.actions;
export const getProfile = (state: any) => state.user.profile;
export const getStatus = (state: any) => state.user.status;
export const getError = (state: any) => state.user.error;
export const getIsNewUser = (state: any) => state.user.isNewUser;
export default userSlice.reducer;
import { createSlice } from '@reduxjs/toolkit'
import { updateUserProfile, userSignIn, userSignOut, userSignUp, googleSignIn, loadUserProfile } from './UserThunks'

export interface UserState {
  profile: {
    uid: string | null,
    name: string | null | undefined,
    email: string | null,
    bio: string | null,
    image: string | undefined,
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
    image: 'https://firebasestorage.googleapis.com/v0/b/luk3v-pollify.appspot.com/o/default.png?alt=media&token=6139a68d-387a-4401-be21-ebafe196613b',
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
      state.profile = action.payload;
      state.isNewUser = true;
      console.log(action.payload);
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
  }
})

// Action creators are generated for each case reducer function
export { updateUserProfile, loadUserProfile, userSignIn, userSignOut, userSignUp, googleSignIn };
export const { resetError } = userSlice.actions;
export const getProfile = (state: any) => state.user.profile;
export const getStatus = (state: any) => state.user.status;
export const getError = (state: any) => state.user.error;
export const getIsNewUser = (state: any) => state.user.isNewUser;
export default userSlice.reducer;
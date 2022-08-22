import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from "../firebase";

export interface UserState {
  profile: {
    uid: string | null,
    name: string | null,
    email: string | null,
    bio: string | null,
    polls: number,
    followers: number,
    following: number
  },
  status: 'idle' | 'loading' | 'success' | 'fail'
  error: string | undefined
}

const initialState: UserState = {
  profile: {
    uid: null,
    name: 'guest',
    email: null,
    bio: null,
    polls: 0,
    followers: 0,
    following: 0
  },
  status: 'idle',
  error: undefined
}

export const userSignUp = createAsyncThunk('user/signup', async ({email, password, confirmPassword}: {email: string, password: string, confirmPassword: string}, { rejectWithValue } ) => {
  if(password !== confirmPassword)
    return rejectWithValue('Passwords do not match');

  const result = await createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      return {
        uid: cred.user.uid,
        email: cred.user.email,
      };
    })
    .catch((err) => {
      switch(err.code) {
        case 'auth/missing-email':
          return rejectWithValue(`Please enter email`);
        case 'auth/email-already-in-use':
          return rejectWithValue(`Email already in use`);
        case 'auth/invalid-email':
          return rejectWithValue(`Email is invalid`);
        case 'auth/operation-not-allowed':
          return rejectWithValue(`Error during sign up`);
        case 'auth/weak-password':
          return rejectWithValue('Password is not strong enough');
        default:
          console.log(err.message);
          return rejectWithValue('Unable to create account');
      }
    });
  return result;
});
export const userSignIn = createAsyncThunk('user/signin', async ({email, password}: {email: string, password: string}, { rejectWithValue } ) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      return {
        uid: cred.user.uid,
        email: cred.user.email,
      };
    })
    .catch((err) => {
      switch(err.code) {
        case 'auth/missing-email':
          return rejectWithValue(`Please enter email`);
        case 'auth/invalid-email':
          return rejectWithValue(`Email is invalid`);
        case 'auth/operation-not-allowed':
          return rejectWithValue(`Error during sign up`);
        case 'auth/wrong-password':
          return rejectWithValue(`Wrong password`);
        default:
          console.log(err.message);
          return rejectWithValue('Unable to sign in');
      }
    });
  return result;
});
export const userSignOut = createAsyncThunk('user/signout', async () => {
  const result = await signOut(auth);
  return result;
});

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
      state.profile.uid = action.payload.uid;
      state.profile.email = action.payload.email;
      console.log(action);
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
      state.profile.uid = action.payload.uid;
      state.profile.email = action.payload.email;
      console.log(action);
    })
    .addCase(userSignIn.rejected, (state, action) => {
      state.status = 'fail';
      state.error = action.payload as string;
    })
    .addCase(userSignOut.fulfilled, (state, action) => {
      state.profile = initialState.profile;
      state.status = 'idle';
      state.error = undefined;
    })
  }
})

// Action creators are generated for each case reducer function
export const { setName, resetError } = userSlice.actions;
export const getProfile = (state: any) => state.user.profile;
export const getStatus = (state: any) => state.user.status;
export const getError = (state: any) => state.user.error;
export default userSlice.reducer;
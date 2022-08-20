import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from "../firebase";

export interface userState {
  value: number
}

const initialState: userState = {
  value: 0,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signup: (state, action) => {
      createUserWithEmailAndPassword(auth, action.payload.email.value, action.payload.password.value)
        .then((cred) => {
          
        })
        .catch((err) => {
          console.log(err.message)
        });
    },
    signout: (state) => {
      signOut(auth)
        .then(() => {
          
        })
        .catch((err) => {
          console.log(err.message)
        });
    },
    signin: (state, action) => {
      signInWithEmailAndPassword(auth, action.payload.email.value, action.payload.password.value)
        .then((cred) => {
          
        })
        .catch((err) => {
          console.log(err.message)
        });
    }
  },
})

// Action creators are generated for each case reducer function
export const { signup, signout, signin } = userSlice.actions

export default userSlice.reducer
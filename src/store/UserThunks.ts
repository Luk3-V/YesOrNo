import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs, DocumentData, writeBatch } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { generateFromEmail, generateUsername } from "unique-username-generator";

import { auth, db, storage } from "../firebase";
import { getProfile, initialState } from './UserSlice';

// --------- AUTH -----------

// TODO DONT MAKE ACCOUNT IF FAILED TO ADD DATABASE
interface signUpInfo {email: string, password: string, confirmPassword: string};
export const userSignUp = createAsyncThunk('user/signup', async ({email, password, confirmPassword}: signUpInfo, { rejectWithValue } ) => {
    if(password !== confirmPassword)
      return rejectWithValue('Passwords do not match');
  
    const result = await createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const user = {
          uid: cred.user.uid as string,
          email: cred.user.email as string,
        };
        return await addUserProfile(user, rejectWithValue);
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
      .then(async (cred) => {
        const user = {
          uid: cred.user.uid,
          email: cred.user.email,
        };
        return await getUserProfile(user.uid, rejectWithValue);
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
    const result = await signOut(auth)
      .catch((err) => {
        console.log(err.message);
      });
    return result;
});

export const googleSignIn = createAsyncThunk('user/googleSignIn', async (_, { rejectWithValue } ) => {
  console.log('google');
  const provider = new GoogleAuthProvider();

  const result = signInWithPopup(auth, provider)
    .then(async (cred) => {
      const user =  {
        uid: cred.user.uid as string,
        email: cred.user.email as string
      };
      console.log(cred.user.photoURL);
      // TODO add image

      if(getAdditionalUserInfo(cred)?.isNewUser)
        return {profile: await addUserProfile(user, rejectWithValue), isNewUser: true};
      else
        return {profile: await getUserProfile(user.uid, rejectWithValue), isNewUser: false};
    })
    .catch((err) => {
      // TODO custom error messages
      switch(err.code) {
        default:
          console.log(err.message);
          return rejectWithValue('Unable to create account');
      }
    });
  return result;
});

// --------- FIRESTORE -----------

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (newInfo: {name: string, bio: string, image: string}, { rejectWithValue, getState }) => {
    const rootState = getState() as {user:{profile:any}}; // TODO better method
    const profile = rootState.user.profile;
    const newProfile = {
      ...profile,
      name: newInfo.name,
      bio: newInfo.bio,
      image: newInfo.image
    }

    const batch = writeBatch(db);
    const userRef = doc(db, "users", newProfile.uid as string );
    batch.set(userRef, newProfile);
    if(profile.name !== newProfile.name) {
      batch.delete(doc(db, "usernames", profile.name)); 
      batch.set(doc(db, "usernames", newProfile.name), {uid: profile.uid})
    }
    const result = await batch.commit()
      .then(() => {
          console.log("Document has been added successfully");
          return newProfile;
      })
      .catch(error => {
          console.log(error);
          return rejectWithValue("Unable to update profile");
      });
    return result;
});

// -----------------------------------

async function addUserProfile(user: {uid: string, email: string, image?: string}, rejectWithValue: Function) {
    let profile = {
      ...initialState.profile,
      uid: user.uid,
      name: await createTempName(user.email),
      email: user.email,
      image: user.image ? user.image : initialState.profile.image
    };

    const batch = writeBatch(db);
    const userRef = doc(db, "users", profile.uid as string );
    const usernameRef = doc(db, "usernames", profile.name);
    batch.set(userRef, profile);
    batch.set(usernameRef, {"uid": profile.uid});
    const result = await batch.commit()
        .then(() => {
            return profile;
        })
        .catch(error => {
            console.log(error);
            return rejectWithValue("Unable to create profile");
        });
    return result;  
}

async function getUserProfile(uid: string, rejectWithValue: Function) {
  const userRef = doc(db, "users", uid as string );
  const profileResult = await getDoc(userRef)
    .then((doc) => {
        return doc.data();
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue("Unable to load profile");
    });
  return profileResult;
}

async function checkNameExists(name: string) {
    const docRef = doc(db, "usernames", name);
    const docSnap = await getDoc(docRef)
    console.log(docSnap);
    return docSnap.exists();
}
/*function createTempName(email: string) {
    let name = generateFromEmail(email, 3);
    console.log(name);
    while(checkNameTaken(name))
        name = generateFromEmail(email, 3);

    return name;
}*/
async function checkUserExists(uid: string) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef)
  console.log(docSnap);
  return docSnap.exists();
}

async function createTempName(email: string) {
    let num = Math.floor(Math.random()*1000);
    console.log(await checkNameExists('user' + num));
    //while(checkNameTaken('user' + num))
    //    num++;

    return 'user' + num;
}
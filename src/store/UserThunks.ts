import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, writeBatch, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';

import { auth, db } from "../firebase";
import { initialState, UserState } from './UserSlice';

// --------- AUTH -----------

export const test = createAsyncThunk('user/test', async (_, { rejectWithValue } ) => {

});

// TODO DONT MAKE ACCOUNT IF FAILED TO ADD DATABASE
interface signUpInfo {email: string, password: string, confirmPassword: string};
export const userSignUp = createAsyncThunk('user/signup', async ({email, password, confirmPassword}: signUpInfo, { rejectWithValue } ) => {
    if(!email)
      return rejectWithValue('Please enter email');
    if(!password)
      return rejectWithValue('Please enter password');
    if(password !== confirmPassword)
      return rejectWithValue('Passwords do not match');

    const result = await createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const user = {
          uid: cred.user.uid as string,
          email: cred.user.email as string,
        };
        return {profile: await addUserProfile(user, rejectWithValue), isNewUser: true};
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
    if(!email)
      return rejectWithValue('Please enter email');
    if(!password)
      return rejectWithValue('Please enter password');

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
  const provider = new GoogleAuthProvider();

  const result = signInWithPopup(auth, provider)
    .then(async (cred) => {
      const user =  {
        uid: cred.user.uid as string,
        email: cred.user.email as string,
        image: cred.user.photoURL as string
      };
      if(getAdditionalUserInfo(cred)?.isNewUser)
        return {profile: await addUserProfile(user, rejectWithValue), isNewUser: true};
      else
        return {profile: await getUserProfile(user.uid, rejectWithValue), isNewUser: false};
    })
    .catch((err) => {
        console.log(err);
        return rejectWithValue(err.message);
    });

  return result;
});

// --------- FIRESTORE -----------

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (newInfo: {name: string, bio: string, image: string}, { rejectWithValue, getState }) => {
    const rootState = getState() as {user: UserState};
    const profile = rootState.user.profile;

    const batch = writeBatch(db);
    const userRef = doc(db, "users", profile.uid as string );
    batch.update(userRef, newInfo);
    if(profile.name && profile.name !== newInfo.name) {
      batch.delete(doc(db, "usernames", profile.name)); 
      batch.set(doc(db, "usernames", newInfo.name), {uid: profile.uid});
    }
    const result = await batch.commit()
      .then(async () => {
          if(profile.polls.length && (profile.name !== newInfo.name || profile.image !== newInfo.image)) {
            return await updateUserPolls(profile.polls, newInfo, rejectWithValue);
          }
          return newInfo;
      })
      .catch(error => {
          console.log(error);
          return rejectWithValue("Unable to update profile");
      });
    return result;
});

export const loadUserProfile = createAsyncThunk('user/loadProfile', async (uid: string, { rejectWithValue }) =>{
  return await getUserProfile(uid, rejectWithValue);
});

export const deleteUserProfile = createAsyncThunk('user/deleteProfile', async (uid: string, { rejectWithValue }) =>{
 
});
// TODO DELETE USER
// get current profile & name
// logout
// delete user
// delete username
// delete profile image
// delete auth
// - add some account not found page

export const addUserPollID = createAsyncThunk('user/addUserPollID', async (pollID: string, { rejectWithValue, getState }) => {
  const rootState = getState() as {user: UserState};
  const profile = rootState.user.profile;

  const userRef = doc(db, "users", profile.uid as string );
  const result = await updateDoc(userRef, { polls: [pollID, ...profile.polls] })
    .then(() => {
      return pollID;
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue("Unable to update profile");
    });
  return result
});

export const deleteUserPollID = createAsyncThunk('user/deleteUserPollID', async (pollID: string, { rejectWithValue, getState }) => {
  const rootState = getState() as {user: UserState};
  const profile = rootState.user.profile;

  const userRef = doc(db, "users", profile.uid as string );
  const result = await updateDoc(userRef, { polls: profile.polls.filter((x) => x !== pollID) })
    .then(() => {
      return pollID;
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue("Unable to update profile");
    });
  return result
});

export const addUserVote = createAsyncThunk('user/addUserVote', async ({vote, pollID}: {vote: string, pollID: string}, { rejectWithValue, getState }) => {
  const rootState = getState() as {user: UserState};
  const profile = rootState.user.profile;
  const newData = {
    yesVotes: vote === 'yes' ? [pollID, ...profile.yesVotes] : profile.yesVotes,
    noVotes: vote === 'no' ? [pollID, ...profile.noVotes] : profile.noVotes
  }

  const userRef = doc(db, "users", profile.uid as string );
  const result = await updateDoc(userRef, newData)
    .then(() => {
      return newData;
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue("Unable to update profile");
    });
  return result
});

export const addUserFollow = createAsyncThunk('user/addUserFollow', async ({follower, following}: {follower: string, following: string}, { rejectWithValue }) => {
  const batch = writeBatch(db);
  batch.update(doc(db, "users", follower), {following: arrayUnion(following)})
  batch.update(doc(db, "users", following), {followers: arrayUnion(follower)})
  const result = await batch.commit()
    .then(() => {
      return following;
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue("Unable to update profile");
    });
  return result
});

export const deleteUserFollow = createAsyncThunk('user/deleteUserFollow', async ({follower, following}: {follower: string, following: string}, { rejectWithValue }) => {
  const batch = writeBatch(db);
  batch.update(doc(db, "users", follower), {following: arrayRemove(following)})
  batch.update(doc(db, "users", following), {followers: arrayRemove(follower)})
  const result = await batch.commit()
    .then(() => {
      return following;
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue("Unable to update profile");
    });
  return result
});

// -----------------------------------

async function addUserProfile(user: {uid: string, email: string, image?: string}, rejectWithValue: Function) {
    let profile = {
      ...initialState.profile,
      uid: user.uid,
      createdAt: new Date().toISOString(),
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
            return rejectWithValue(error.message);
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
        return rejectWithValue(error.message);
    });
  return profileResult;
}

async function updateUserPolls(polls: Array<string>, newInfo: {name: string, bio: string, image: string}, rejectWithValue: Function) {
  const batch = writeBatch(db);

  polls.forEach((pollID) => {
    batch.update(doc(db, "polls", pollID), { name: newInfo.name, profileImage: newInfo.image });
  });

  const result = await batch.commit()
    .then(() => {
        return newInfo;
    })
    .catch(error => {
        console.log(error);
        return rejectWithValue(error.message);
    });
  return result;
}

async function checkNameExists(name: string) {
    const docRef = doc(db, "usernames", name);
    const docSnap = await getDoc(docRef)
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
  return docSnap.exists();
}
async function createTempName(email: string) {
    let num = Math.floor(Math.random()*1000);
    let valid = false;
    while(!valid) {
      if(await checkNameExists('user' + num))
        num++;
      else
        valid = true;
    }
    return 'user' + num;
}
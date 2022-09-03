import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserSlice'
import pollsReducer from './PollsSlice'

export const store = configureStore({
	reducer: {
		user: userReducer,
		polls: pollsReducer
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
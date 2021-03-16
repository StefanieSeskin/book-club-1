import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import usersReducer from '../features/users/usersSlice'
import authReducer from '../features/auth/auth'
import genreuserReducer from '../features/genresbyuser/genreuserSlice'
import bookclubReducer from '../features/bookclub/bookclubSlice'
import profilesReducer from '../features/profile/profileSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    users: usersReducer,
    auth: authReducer,
    genreuser: genreuserReducer,

    userState:profilesReducer,
    bookuserState:profilesReducer,
    genreuserState:profilesReducer,

    bookclub: bookclubReducer,

  },
})

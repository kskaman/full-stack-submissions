import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { setNotificationWithTimeout } from './notificationReducer'
import blogService from '../services/blogs'
import registerService from '../services/register'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

// Thunk action for logging in a user
export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setNotificationWithTimeout(`Logged in as ${user.username}`, 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Invalid username or password', 'fail', 5))
    }
  }
}

// Thunk action for logging in a user
export const registerUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await registerService.register(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setNotificationWithTimeout(`Logged in as ${user.username}`, 'success', 5))
    } catch (error) {
      dispatch(setNotificationWithTimeout('Registration failed', 'fail', 5))
    }
  }
}

// Thunk action for logging out a user
export const logoutUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
    dispatch(setNotificationWithTimeout('Logged out successfully', 'success', 5))
  }
}

// Thunk action to initialize user from local storage
export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export default userSlice.reducer
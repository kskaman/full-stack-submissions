import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', flag: '' },
  reducers: {
    setNotification(state, action) {
      return { message: action.payload.message, flag: action.payload.flag }
    },
    clearNotification() {
      return { message: '', flag: '' }
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotificationWithTimeout = (message, flag, timeout) => {
  return dispatch => {
    dispatch(setNotification({ message, flag }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
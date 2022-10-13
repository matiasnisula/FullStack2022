import { createSlice } from '@reduxjs/toolkit'

const initialState = "Toimiiko"

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null;
    }
  }
})
console.log("notificationSlice: ", notificationSlice)

export const { setNotificationMessage, clearNotification } = notificationSlice.actions

export const setNotificationWithTimeout = (message, timeInSec) => {
  return (dispatch, getState) => {
    dispatch(setNotificationMessage(message))

    setTimeout(() => {
      dispatch(clearNotification())
    }, (timeInSec * 1000))
  }
}

export default notificationSlice.reducer

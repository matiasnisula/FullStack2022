import { createSlice } from '@reduxjs/toolkit'

const initialState = "Toimiiko"

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    deleteNotification(state, action) {
      return null;
    }
  }
})
console.log("notificationSlice: ", notificationSlice)

export const { setNotificationMessage, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer

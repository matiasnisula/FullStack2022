import { createSlice } from "@reduxjs/toolkit";

let timeoutId;

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return { ...action.payload };
    },
    clearNotification(state, action) {
      return null;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const setNotificationWithTimeout = (message, type, timeInSec) => {
  return (dispatch, getState) => {
    clearTimeout(timeoutId);
    dispatch(setNotification({ message, type }));

    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, timeInSec * 1000);
  };
};

export default notificationSlice.reducer;

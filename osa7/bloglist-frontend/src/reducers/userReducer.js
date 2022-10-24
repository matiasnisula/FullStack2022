import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export const initUsers = () => {
  return async (dispatch, getState) => {
    const users = await userService.getAll();
    console.log("users (getAll): ", users);
    dispatch(setUsers(users));
  };
};

export default userSlice.reducer;

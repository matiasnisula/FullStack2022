import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";

const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState: null,
  reducers: {
    setLoggedUser(state, action) {
      return action.payload;
    },
    clearLoggedUser(state, action) {
      return null;
    },
  },
});

export const { setLoggedUser, clearLoggedUser } = loggedUserSlice.actions;

export const login = (username, password) => {
  return async (dispatch, getState) => {
    const user = await loginService.login({
      username,
      password,
    });
    dispatch(setLoggedUser(user));
    window.localStorage.setItem("loggedUser", JSON.stringify(user));
    blogService.setToken(user.token);
  };
};

export const logout = () => {
  return function (dispatch, getState) {
    window.localStorage.removeItem("loggedUser");
    dispatch(clearLoggedUser());
  };
};

export const initLoggedUserFromLocalStorage = () => {
  return function (dispatch, getState) {
    const loggedUser = window.localStorage.getItem("loggedUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      dispatch(setLoggedUser(user));
      blogService.setToken(user.token);
    }
  };
};

export default loggedUserSlice.reducer;

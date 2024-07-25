
// userActions.ts
import { SET_USERNAME, SetUsernameAction, LOG_IN, LogInAction, LOG_OUT, LogOutAction } from "../types/userTypes";

export const setUsername = (username: string): SetUsernameAction => ({
  type: SET_USERNAME,
  payload: username,
});

export const logIn = (): LogInAction => ({
  type: LOG_IN,
});

export const logOut = (): LogOutAction => ({
  type: LOG_OUT,
});


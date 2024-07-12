
// userTypes.ts


export interface UserState {
  username: string | null;
  isLoggedIn: boolean;
}

export const SET_USERNAME = "SET_USERNAME";

interface SetUsernameAction {
  type: typeof SET_USERNAME;
  payload: string;
}

export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";

export interface LogInAction {
  type: typeof LOG_IN;
}

export interface LogOutAction {
  type: typeof LOG_OUT;
}
export type { SetUsernameAction };
export type UserActionTypes = SetUsernameAction | LogInAction | LogOutAction;


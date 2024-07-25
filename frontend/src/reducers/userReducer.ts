// userReducer.ts
import { UserState, UserActionTypes, SET_USERNAME, LOG_IN, LOG_OUT } from "../types/userTypes";

const initialState: UserState = {
  username: null,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case LOG_IN:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOG_OUT:
      return {
        ...state,
        username: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default userReducer;

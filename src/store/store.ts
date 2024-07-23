// src/redux/store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import recipeReducer from '../reducers/recipeSlice'; // Adjust the path as needed
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    // Add other reducers if needed
  },
  // Default middleware includes thunk by default
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Optional: disable serializable check if needed
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store; // Ensure default export is included

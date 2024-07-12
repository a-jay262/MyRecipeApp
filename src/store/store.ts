// src/redux/store.ts
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import recipeReducer, { RecipeState } from '../reducers/recipeSlice';

export interface RootState {
  recipes: RecipeState;
  // Add other slice states if any
}

const rootReducer = combineReducers({
  recipes: recipeReducer,
  // Add other reducers if any
});

const store = configureStore({
  reducer: rootReducer,
});

export default store as EnhancedStore<RootState>;

// src/store/recipeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk, RootState } from '../store/store';

export interface Step {
  step: string;
  des: string;
}

export interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id: string;
  id: number;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[];
  category: string;
  image: string | null;
  checked: boolean;
  cookCount: number;
  favorites: boolean; // Added favorite field
}

export interface RecipeState {
  recipes: Recipe[];
  favorites: string[];
  checkedCount: number;
  searchQuery: string;
  alertText: string; // Added for alert text
  showAlert: boolean; // Added for showing/hiding alert
}

const initialState: RecipeState = {
  recipes: [],
  favorites: [],
  checkedCount: 0,
  searchQuery: '',
  alertText: '',
  showAlert: false,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    incrementCheckedCount: (state) => {
      state.checkedCount += 1;
    },
    updateRecipeStepsOrder: (
      state,
      action: PayloadAction<{ id: string; reorderedSteps: Step[] }>
    ) => {
      const { id, reorderedSteps } = action.payload;
      const recipe = state.recipes.find((recipe) => recipe._id === id);
      if (recipe) {
        recipe.steps = reorderedSteps;
      }
    },
    toggleFavoriteState: (state, action: PayloadAction<string>) => {
      const recipe = state.recipes.find((recipe) => recipe._id === action.payload);
      if (recipe) {
        recipe.favorites = !recipe.favorites;
      }
    },
    setAlert: (state, action: PayloadAction<{ text: string; show: boolean }>) => {
      state.alertText = action.payload.text;
      state.showAlert = action.payload.show;
    },
    clearAlert: (state) => {
      state.alertText = '';
      state.showAlert = false;
    }
  },
});

export const {
  setRecipes,
  setFavorites,
  setSearchQuery,
  incrementCheckedCount,
  updateRecipeStepsOrder,
  toggleFavoriteState,
  setAlert,
} = recipeSlice.actions;

export const fetchRecipes = (): AppThunk => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/recipes');
    dispatch(setRecipes(response.data));
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
  }
};

export const syncRecipe = (recipeData: Partial<Recipe>): AppThunk => async (dispatch) => {
  try {
    if (recipeData._id) {
      await axios.put(`http://localhost:5000/recipes/${recipeData._id}`, recipeData);
    } else {
      await axios.post('http://localhost:5000/recipes', recipeData);
    }
    dispatch(fetchRecipes());
    console.log("Recipe Sync Success");
    dispatch(setAlert({ text: "Recipe synchronized successfully!", show: true }));
  } catch (error) {
    console.error('Failed to sync recipe:', error);
    dispatch(setAlert({ text: "Failed to synchronize recipe.", show: true }));
  }
};

export const addRecipe = (recipeData: Omit<Recipe, '_id' | 'id' | 'checked' | 'cookCount' | 'favorites'>): AppThunk => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5000/recipes', recipeData);
    dispatch(fetchRecipes());
    dispatch(setAlert({ text: "Recipe added successfully!", show: true }));
  } catch (error) {
    console.error('Failed to add recipe:', error);
    dispatch(setAlert({ text: "Failed to add recipe.", show: true }));
  }
};

export const editRecipe = (id: number, recipeData: Partial<Recipe>): AppThunk => async (dispatch) => {
  try {
    await axios.put(`http://localhost:5000/recipes/${id}`, recipeData);
    dispatch(fetchRecipes());
    dispatch(setAlert({ text: "Recipe updated successfully!", show: true }));
  } catch (error) {
    console.error('Failed to edit recipe:', error);
    dispatch(setAlert({ text: "Failed to update recipe.", show: true }));
  }
};

export const toggleRecipe = (id: string): AppThunk => async (dispatch) => {
  try {
    await axios.patch(`http://localhost:5000/recipes/${id}/toggle`);
    dispatch(fetchRecipes());
    dispatch(incrementCheckedCount());
    dispatch(setAlert({ text: "Recipe toggled successfully!", show: true }));
  } catch (error) {
    console.error('Failed to toggle recipe:', error);
    dispatch(setAlert({ text: "Failed to toggle recipe.", show: true }));
  }
};

export const toggleFavorite = (id: string): AppThunk => async (dispatch) => {
  try {
    await axios.patch(`http://localhost:5000/recipes/${id}/favorite`);
    dispatch(fetchRecipes());
    dispatch(toggleFavoriteState(id));
    dispatch(setAlert({ text: "Favorite status toggled successfully!", show: true }));
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    dispatch(setAlert({ text: "Failed to toggle favorite.", show: true }));
  }
};

export const selectFilteredRecipes = (state: RootState) => {
  const { recipes, searchQuery } = state.recipes;
  if (!searchQuery) {
    return recipes;
  }
  return recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.item.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
};

export const selectAlert = (state: RootState) => ({
  text: state.recipes.alertText,
  show: state.recipes.showAlert,
});

export default recipeSlice.reducer;
export const selectFavorites = (state: RootState) => state.recipes.favorites;

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
}

const initialState: RecipeState = {
  recipes: [],
  favorites: [],
  checkedCount: 0,
  searchQuery: '',
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
  },
});

export const {
  setRecipes,
  setFavorites,
  setSearchQuery,
  incrementCheckedCount,
  updateRecipeStepsOrder,
  toggleFavoriteState,
} = recipeSlice.actions;

export const fetchRecipes = (): AppThunk => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/recipes');
    dispatch(setRecipes(response.data));
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
  }
};

export const addRecipe = (recipeData: Omit<Recipe, '_id' | 'id' | 'checked' | 'cookCount' | 'favorites'>): AppThunk => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5000/recipes', recipeData);
    console.log('Response from server:', response);
    dispatch(fetchRecipes());
    console.log('Recipe data:', recipeData);
    alert("Done");
  } catch (error) {
    console.error('Failed to add recipe:', error);
  }
};

export const editRecipe = (id: number, recipeData: Partial<Recipe>): AppThunk => async (dispatch) => {
  try {
    await axios.put(`http://localhost:5000/recipes/${id}`, recipeData);
    dispatch(fetchRecipes());
  } catch (error) {
    console.error('Failed to edit recipe:', error);
  }
};

export const toggleRecipe = (id: string): AppThunk => async (dispatch) => {
  try {
    await axios.patch(`http://localhost:5000/recipes/${id}/toggle`);
    dispatch(fetchRecipes());
    dispatch(incrementCheckedCount());
  } catch (error) {
    console.error('Failed to toggle recipe:', error);
  }
};

export const toggleFavorite = (id: string): AppThunk => async (dispatch) => {
  try {
    await axios.patch(`http://localhost:5000/recipes/${id}/favorite`);
    dispatch(fetchRecipes());
    dispatch(toggleFavoriteState(id));
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
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

export default recipeSlice.reducer;
export const selectFavorites = (state: RootState) => state.recipes.favorites;

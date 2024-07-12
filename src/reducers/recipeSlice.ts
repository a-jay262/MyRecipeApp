import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

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
  id: number;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[]; 
  checked: boolean;
  cookCount: number;
}

export interface RecipeState {
  recipes: Recipe[]; 
  favorites: number[];
  checkedCount: number; 
}

const initialState: RecipeState = {
  recipes: [],
  favorites: [],
  checkedCount: 0,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<{ name: string; size: number; steps: Step[], ingredients: Ingredients[] }>) => {
      const { name, size, steps, ingredients } = action.payload;
    
      // Determine the new id for the recipe
      const maxId = state.recipes.reduce((max, recipe) => Math.max(recipe.id, max), 0);
      const newRecipeId = maxId + 1;
    
      // Create a new recipe object
      const newRecipe: Recipe = {
        id: newRecipeId,
        name,
        size,
        ingredients,
        steps,
        checked: false,
        cookCount: 0,
      };
    
      // Return a new state object with the new recipe added
      return {
        ...state,
        recipes: [...state.recipes, newRecipe],
      };
    },    
    editRecipe: (
      state,
      action: PayloadAction<{ id: number; name: string; steps: Step[], ingredients: Ingredients[] }>
    ) => {
      const { id, name, steps, ingredients } = action.payload;
      
      const recipeIndex = state.recipes.findIndex(recipe => recipe.id === id);
      if (recipeIndex !== -1) {
        state.recipes[recipeIndex] = {
          ...state.recipes[recipeIndex],
          name,
          steps,
          ingredients,
        };
      }
    },
    updateRecipesOrder: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    toggleRecipe: (state, action: PayloadAction<{ id: number }>) => {
      const recipe = state.recipes.find(r => r.id === action.payload.id);
      if (recipe) {
        if (!recipe.checked) {
          recipe.checked = true;
          state.checkedCount += 1;
        }
        recipe.cookCount += 1;
      }
    },
    updateRecipeStepsOrder: (
      state,
      action: PayloadAction<{ id: number; reorderedSteps: Step[] }>
    ) => {
      const { id, reorderedSteps } = action.payload;
      const recipe = state.recipes.find((recipe) => recipe.id === id);
      if (recipe) {
        recipe.steps = reorderedSteps;
      }
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const recipeId = action.payload;
      if (state.favorites.includes(recipeId)) {
        state.favorites = state.favorites.filter((id) => id !== recipeId);
      } else {
        state.favorites.push(recipeId);
      }
    },
  },
});

export const { addRecipe, updateRecipeStepsOrder, toggleRecipe, editRecipe, toggleFavorite } = recipeSlice.actions;

export default recipeSlice.reducer;
export const selectFavorites = (state: RootState) => state.recipes.favorites;

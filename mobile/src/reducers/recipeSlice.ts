import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  userId: string;
  id: number;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[];
  category: string;
  image: string | null;
  checked: boolean;
  public: boolean;
  cookCount: number;
  favorites: boolean; 
}

export interface RecipeState {
  recipes: Recipe[];
  favorites: string[];
  checkedCount: number;
  searchQuery: string;
  alertText: string; 
  showAlert: boolean; 
}

const initialState: RecipeState = {
  recipes: [],
  favorites: [],
  checkedCount: 0,
  searchQuery: '',
  alertText: '',
  showAlert: false,
};

export const BASE_URL = 'http://192.168.16.128:5000'; // Updated to use your development machine's IP address

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
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await dispatch(logout()); // Handle token expiration
      return; // Exit the function to avoid making the API call
    }
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/recipes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setRecipes(response.data));
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
  }
};

export const syncRecipe = (recipeData: Partial<Recipe>): AppThunk => async (dispatch) => {
  try {
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await dispatch(logout()); // Handle token expiration
      return; // Exit the function to avoid making the API call
    }
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    // Configure axios request headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (recipeData._id) {
      // Update existing recipe
      await axios.put(`${BASE_URL}/recipes/${recipeData._id}`, recipeData, { headers });
    } else {
      // Create new recipe
      await axios.post(`${BASE_URL}/recipes`, recipeData, { headers });
    }

    // Fetch the updated list of recipes
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
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await dispatch(logout()); // Handle token expiration
      return; // Exit the function to avoid making the API call
    }
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    // Configure axios request headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Add the recipe
    await axios.post(`${BASE_URL}/recipes`, recipeData, { headers });
    dispatch(fetchRecipes());
    dispatch(setAlert({ text: "Recipe added successfully!", show: true }));
    //socket.emit('recipe-added', recipeData);
  } catch (error) {
    console.error('Failed to add recipe:', error);
    dispatch(setAlert({ text: "Failed to add recipe.", show: true }));
  }
};

export const editRecipe = (id: number, recipeData: Partial<Recipe>): AppThunk => async (dispatch) => {
  try {
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await dispatch(logout()); // Handle token expiration
      return; // Exit the function to avoid making the API call
    }
    const token = await AsyncStorage.getItem('token');

    await axios.put(`${BASE_URL}/recipes/${id}`, recipeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(fetchRecipes());
    dispatch(setAlert({ text: "Recipe updated successfully!", show: true }));
  } catch (error) {
    console.error('Failed to edit recipe:', error);
    dispatch(setAlert({ text: "Failed to update recipe.", show: true }));
  }
};


export const toggleRecipe = (id: string): AppThunk => async (dispatch) => {
  try {
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await dispatch(logout()); // Handle token expiration
      return; // Exit the function to avoid making the API call
    }
    const token = await AsyncStorage.getItem('token');

    await axios.patch(`${BASE_URL}/recipes/${id}/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const tokenExpired = await isTokenExpired();
    if (tokenExpired) {
      await dispatch(logout()); // Handle token expiration
      return; // Exit the function to avoid making the API call
    }
    const token = await AsyncStorage.getItem('token');

    await axios.patch(`${BASE_URL}/recipes/${id}/favorite`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
  return recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.item.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
};

export const logout = (): AppThunk => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'LOGOUT_SUCCESS' }); // Dispatch a Redux action to handle state change
    console.log("Logged out successfully");
    // Optionally redirect to login screen
    // For React Native, use navigation
    // For React web, use history or React Router's useNavigate
  } catch (error) {
    console.error('Failed to log out:', error);
    dispatch({ type: 'LOGOUT_FAILURE' }); // Handle logout failure if needed
  }
};

export const setTokenWithExpiration = async (token: string, expiresIn: number) => {
  const expirationDate = new Date().getTime() + expiresIn * 1000; // Convert seconds to milliseconds
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('tokenExpiration', expirationDate.toString());
};

const isTokenExpired = async () => {
  const expiration = await AsyncStorage.getItem('tokenExpiration');
  if (expiration) {
    return new Date().getTime() > parseInt(expiration);
  }
  return true;
};


export const saveRecipeToLocal = async (recipe: Recipe) => {
  try {
    const storedRecipes = await AsyncStorage.getItem('recipes');
    const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
    recipes.push(recipe);
    await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
  } catch (error) {
    console.error('Failed to save recipe:', error);
  }
};

export const loadRecipesFromLocal = async () => {
  try {
    const storedRecipes = await AsyncStorage.getItem('recipes');
    return storedRecipes ? JSON.parse(storedRecipes) : [];
  } catch (error) {
    console.error('Failed to load recipes:', error);
    return [];
  }
};

export const selectAlert = (state: RootState) => ({
  text: state.recipes.alertText,
  show: state.recipes.showAlert,
});

export default recipeSlice.reducer;
export const selectFavorites = (state: RootState) => state.recipes.favorites;

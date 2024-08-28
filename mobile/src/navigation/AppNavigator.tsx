import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SignUpScreen from '../screens/SignUp';
import LogInScreen from '../screens/LogIn';
import MenuScreen from '../screens/MenuScreen';
import RecipeList from '../screens/RecipeListScreen';
import CookPage from '../screens/CookPageScreen';
import GroceryRecipeScreen from '../screens/GroceryRecipesScreen';
import GroceryList from '../screens/GroceryListScreen';
import AddRecipe from '../screens/AddRecipeScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  SignUp: undefined;
  LogIn: undefined;
  MenuScreen: {
    email: string;
    username: string;
    profilePicture: string;
    id: string;
  };
  ListScreen: undefined;
  CookPage: { id: string };
  GroceryRecipe: {id:string, email:string};
  GroceryList: {selectedRecipes: string[], servingSize: number, id:string, email:string};
  AddRecipe: {id: string};
  ProfileScreen: {userId : string};
};


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="ListScreen" component={RecipeList} />
        <Stack.Screen name="CookPage" component={CookPage} />
        <Stack.Screen name="GroceryRecipe" component={GroceryRecipeScreen} />
        <Stack.Screen name="GroceryList" component={GroceryList} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

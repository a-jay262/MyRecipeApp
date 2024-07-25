// src/App.tsx
import React from "react";
import RecipeForm from "./components/Recipe/recipeForm";
import RecipeList from "./components/Recipe/recipeList";
import CookPage from "./components/Recipe/cookPage";
import EditRecipeForm from "./components/Recipe/editRecipeForm";
import EditRecipeList from "./components/Recipe/editRecipeList";
import Menu2 from "./components/Recipe/menu2";
import HomePage from "./components/Recipe/HomePage";
import GroceryRecipeList from "./components/Recipe/groceryRecipeList";
import GroceryList from "./components/Recipe/groceryList";
import RecipeListSize from "./components/Recipe/recipeListSize";
import "./components/Recipe/HomePage.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CookPageSize from "./components/Recipe/cookPageSize";
import Favorities  from "./components/Recipe/favorities";
import NavBar  from "./components/Recipe/Navbar";
import LogIn  from "./components/Auth/logIn";
import SignUp from "./components/Auth/signUp";
import MostCooked from "./components/Recipe/mostCooked";

const App: React.FC = () => {
  return (
      <div>
        <Router>
                  <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/most-cooked" element={<MostCooked />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/add-recipe" element={<RecipeForm />} />
            <Route path="/recipe-list" element={<RecipeList />} />
            <Route path="/menu" element={<Menu2 />} />
            <Route path="/grocery-recipe-list" element={<GroceryRecipeList />} />
            <Route path="/grocery-list" element={<GroceryList />} />
            <Route path="/favorities" element={<Favorities />} />
            <Route path="/edit-list" element={<EditRecipeList />} />
            <Route path="/edit-form/:id" element={<EditRecipeForm />} />
            <Route path="/cook/:id" element={<CookPage />} />
            <Route path="/recipe-list-size/:size" element={<RecipeListSize />} />
            <Route path="/cook-size/:id/:servingSize" element = {<CookPageSize/>} />
          </Routes>
        </Router>
      </div>
  );
};


export default App;

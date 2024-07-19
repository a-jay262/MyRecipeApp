// src/App.tsx
import React from "react";
import RecipeForm from "./components/recipeForm";
import RecipeList from "./components/recipeList";
import CookPage from "./components/cookPage";
import EditRecipeForm from "./components/editRecipeForm";
import EditRecipeList from "./components/editRecipeList";
import Menu2 from "./components/menu2";
import HomePage from "./components/HomePage";
import GroceryRecipeList from "./components/groceryRecipeList";
import GroceryList from "./components/groceryList";
import RecipeListSize from "./components/recipeListSize";
import "./components/HomePage.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CookPageSize from "./components/cookPageSize";
import Favorities  from "./components/favorities";
import NavBar  from "./components/Navbar";
import LogIn  from "./components/logIn";
import SignUp from "./components/signUp";
import MostCooked from "./components/mostCooked";

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

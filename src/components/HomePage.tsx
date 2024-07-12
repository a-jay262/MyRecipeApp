import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import img from "../assets/vector.png";
import RecipeCard from "./RecipeCard"; // Ensure correct path and filename here

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  // Function to get top 3 most cooked recipes
  const getTopCookedRecipes = (): any[] => {
    // Sort recipes based on cookCount in descending order
    const sortedRecipes = recipes
      .slice()
      .sort((a, b) => b.cookCount - a.cookCount);
    // Take top 3 recipes
    return sortedRecipes.slice(0, 3);
  };

  const [mostCookedRecipes, setMostCookedRecipes] = useState<any[]>([]);

  useEffect(() => {
    const topRecipes = getTopCookedRecipes();
    setMostCookedRecipes(topRecipes);
  }, [recipes]);

  return (
    <div>
      <div className="home-page">
        <div className="image-container">
          <img src={img} alt="Recipe" className="recipe-image" />
        </div>
        <div className="right-content">
          <div className="welcome-text">
            <h1>Welcome to My Recipe App</h1>
            <p>Store Your Favourite Recipes.</p>
            <button onClick={handleGetStarted} className="get-started-button">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

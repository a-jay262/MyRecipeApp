// src/components/FavoritesList.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../reducers/recipeSlice";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Ant Design Icons
import "./recipeList.css";

const Favorites: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favorites = useSelector((state: RootState) => state.recipes.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter only the recipes that are in the favorites list
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  const handleCookToday = (id: number) => {
    navigate(`/cook/${id}`);
  };

  const handleBack = () => {
    navigate('/menu');
  };

  const handlelist = () => {
    navigate('/recipe-list');
  };

  const handleToggleFavorite = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div className="recipe-list-container">
      <div className="header3">
        <div className="button-container">
          <button className="nav-button" onClick={handleBack}>
            <span className="arrow-icon">&#8592;</span> {/* Left arrow icon */}
          </button>
        </div>
        <div className="header-title">
          <h2>Recipes that you have added and love to cook</h2>
        </div>
      </div>
      <div className="overlay">
        <div className="tab-container">
          <button className="tab" onClick={handlelist}>Recipe List</button>
          <button className="tab active">Favorites</button>
        </div>
        <ul className="recipe-list">
          {favoriteRecipes.length > 0 ? (
            favoriteRecipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <img
                  src={recipe.image ?? undefined}
                  alt={recipe.name}
                  className="recipe-image"
                />
                <div className="recipe-info">
                  <span className="recipe-name">{recipe.name}</span>
                </div>
                <div className="cook-info">
                  <span className="cook-count">
                    Cooked: {recipe.cookCount}{" "}
                    {recipe.cookCount === 1 ? "time" : "times"}
                  </span>
                  <span
                    className="favorite-icon"
                    onClick={() => handleToggleFavorite(recipe.id)}
                  >
                    {favorites.includes(recipe.id) ? (
                      <AiFillHeart color="red" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p>No favorite recipes yet. Add some by clicking the heart icon!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Favorites;

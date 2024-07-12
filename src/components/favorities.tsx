// src/components/FavoritesList.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../reducers/recipeSlice";
import './recipeList.css';
import "./recipe.css";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Ant Design Icons

const Favorities: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favorites = useSelector((state: RootState) => state.recipes.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter only the recipes that are in the favorites list
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  const handleCookToday = (id: number) => {
    navigate(`/cook/${id}`);
  };

  const handleToggleFavorite = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div>
      <h2>Favorites List</h2>
      <ul className="recipe-list">
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              <span className="recipe-name">{recipe.name}</span>
              <span className="cook-count">
                Cooked: {recipe.cookCount} {recipe.cookCount === 1 ? "time" : "times"}
              </span>
              <button
                className="recipe-button2"
                onClick={() => handleCookToday(recipe.id)}
              >
                Cook Today
              </button>
              <span
                className="favorite-icon"
                onClick={() => handleToggleFavorite(recipe.id)}
                role="button"
                aria-label={favorites.includes(recipe.id) ? "Remove from favorites" : "Add to favorites"}
                tabIndex={0}
              >
                {favorites.includes(recipe.id) ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
              </span>
            </li>
          ))
        ) : (
          <p>No favorite recipes yet. Add some by clicking the heart icon!</p>
        )}
      </ul>
    </div>
  );
};

export default Favorities;

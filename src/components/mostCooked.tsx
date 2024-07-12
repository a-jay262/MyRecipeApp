import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../reducers/recipeSlice";
import "./recipeList.css";
import "./recipe.css";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Ant Design Icons

const RecipeList: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favorites = useSelector((state: RootState) => state.recipes.favorites);
  const checkedCount = useSelector((state: RootState) => state.recipes.checkedCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCookToday = (id: number) => {
    navigate(`/cook/${id}`);
  };

  const handleToggleFavorite = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  // Filter recipes that have been cooked at least once
  const cookedRecipes = recipes.filter((recipe) => recipe.cookCount > 0);

  // Sort recipes based on cookCount in descending order
  const sortedRecipes = cookedRecipes.slice().sort((a, b) => b.cookCount - a.cookCount);

  return (
    <div>
      <h2>Recipe List (Checked: {checkedCount})</h2>
      <ul className="recipe-list">
        {sortedRecipes.map((recipe) => (
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
            >
              {favorites.includes(recipe.id) ? (
                <AiFillHeart color="red" />
              ) : (
                <AiOutlineHeart />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;

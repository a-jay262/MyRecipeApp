import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleFavorite } from "../reducers/recipeSlice";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Ant Design Icons
import "./recipeList.css";

const RecipeList: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favorites = useSelector((state: RootState) => state.recipes.favorites);
  const checkedCount = useSelector(
    (state: RootState) => state.recipes.checkedCount
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCookToday = (id: number) => {
    navigate(`/cook/${id}`);
  };

  const handleBack = () => {
    navigate('/menu');
  };

  const handlefav = () => {
    navigate('/favorities');
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
          <button className="tab active">Recipe List</button>
          <button className="tab" onClick={handlefav}>Favorites</button>
        </div>
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item" onClick={() => handleCookToday(recipe.id)}>
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
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeList;

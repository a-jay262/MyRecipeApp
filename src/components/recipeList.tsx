import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from '../store/store'; 
import { RootState } from "../store/store";
import { toggleFavorite, fetchRecipes } from "../reducers/recipeSlice";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./recipeList.css";

const RecipeList: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favorites = useSelector((state: RootState) => state.recipes.favorites);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const handleCookToday = (id: string) => {
    navigate(`/cook/${id}`);
  };

  const handleBack = () => {
    navigate('/menu');
  };

  const handlefav = () => {
    navigate('/favorities');
  };

  const handleToggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(id));
  };

  return (
    <div className="recipe-list-container">
      <div className="header3">
        <div className="button-container">
          <button className="nav-button" onClick={handleBack}>
            <span className="arrow-icon">&#8592;</span>
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
            <li key={recipe._id} className="recipe-item" onClick={() => handleCookToday(recipe._id)}>
              <img
                src={`http://localhost:5000${recipe.image}`}
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
                  onClick={(event) => handleToggleFavorite(recipe._id, event)}
                >
                    {recipe.favorites ? (
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

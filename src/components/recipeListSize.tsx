// Inside your component on the target page
import { useParams } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from 'react-router-dom';

const RecipeListSize: React.FC = () => {
    const { size } = useParams<{ size: string }>(); // Using string to get the parameter

  const servingSize = size ? parseInt(size, 10) : 5; // Default to 5 if size is not valid

  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const checkedCount = useSelector(
    (state: RootState) => state.recipes.checkedCount
  );

  const navigate = useNavigate();

  const handleCookToday = (id: number) => {
    alert(`Recipe Serving Size being adjusted to: ${servingSize}`);
    navigate(`/cook-size/${id}/${servingSize}`);
  };


  return (
    <div>
      <h1>Recipe List Size</h1>
      <p>Selected Serving Size: {servingSize}</p>
      {/* Rest of your component */}
      <ul className="recipe-list">
    {checkedCount != null &&
      recipes.map((recipe) => (
        <li key={recipe.id} className="recipe-item">
          {recipe.name}
          <span className="cook-count">
            Cooked: {recipe.cookCount} {recipe.cookCount === 1 ? "time" : "times"}
          </span>
          <button
            className="recipe-button2"
            onClick={() => handleCookToday(recipe.id)}
          >
            Cook Today
          </button>
        </li>
      ))}
  </ul>
    </div>
  );
};

export default RecipeListSize;

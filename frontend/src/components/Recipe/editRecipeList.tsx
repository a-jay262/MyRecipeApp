// src/components/RecipeList.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import './recipeList.css';
import {useNavigate} from "react-router-dom";

const RecipeList: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const checkedCount = useSelector(
    (state: RootState) => state.recipes.checkedCount
  );

  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/edit-form/${id}`);
  };
  return (
    <div>
  <h2>Recipe List (Checked: {checkedCount})</h2>
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
            onClick={() => handleEdit(recipe.id)}
          >
            Edit
          </button>
        </li>
      ))}
  </ul>
</div>


  );
};

export default RecipeList;

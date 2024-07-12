// src/components/GroceryRecipeList.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import './groceryRecipeList.css';

const GroceryRecipeList: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [servingSize, setServingSize] = useState<number>(5);
  const navigate = useNavigate();

  const handleCheckboxChange = (id: number) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((recipeId) => recipeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleGetGroceryList = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleIncrement = () => {
    setServingSize((prevSize) => prevSize + 5);
  };

  const handleDecrement = () => {
    setServingSize((prevSize) => (prevSize > 5 ? prevSize - 5 : 1));
  };

  const handleSaveDialog = () => {
    setDialogOpen(false);
    navigate("/grocery-list", { state: { selectedRecipes, servingSize } });
  };

  return (
    <div>
      <h1>Recipe List</h1>
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            <input
              type="checkbox"
              checked={selectedRecipes.includes(recipe.id)}
              onChange={() => handleCheckboxChange(recipe.id)}
            />
            <span className="recipe-name">{recipe.name}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleGetGroceryList} className="get-grocery-button">
        Get Grocery List
      </button>

      {dialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseDialog}>&times;</span>
            <h3>Edit Serving Size</h3>
            <div className="input-group">
              <button type="button" onClick={handleDecrement}>- 5</button>
              <input
                type="number"
                className="recipe-input"
                value={servingSize}
                readOnly
              />
              <button type="button" onClick={handleIncrement}>+ 5</button>
            </div>
            <div className="button-group">
              <button type="button" onClick={handleSaveDialog}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryRecipeList;

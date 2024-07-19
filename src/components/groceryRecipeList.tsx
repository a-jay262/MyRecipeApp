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

  const handleBack = () => {
    navigate("/menu");
  };

  return (
    <div className="container">
      <div className="button-container">
        <button className="nav-button" onClick={handleBack}>
          <span className="arrow-icon">&#8592;</span> {/* Left arrow icon */}
        </button>
      </div>
      <div className="overlay2">
        <h4>Get Grocery</h4>
        <ul className="recipe-list4">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item4">
              <input
                type="checkbox"
                checked={selectedRecipes.includes(recipe.id)}
                onChange={() => handleCheckboxChange(recipe.id)}
                style={{ width: "20px", height: "20px" }} 
                className="checkbox2"
              />
              <img src={recipe.image ?? undefined} alt={recipe.name} className="recipe-image4" />
              <span className="recipe-name4">{recipe.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleGetGroceryList} className="get-grocery-button">
        Get Grocery
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
                className="recipe-input4"
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

// src/components/GroceryList.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
}


const adjustIngredientsForServingSize = (
  ingredients: Ingredient[],
  originalServingSize: number,
  newServingSize: number
): Ingredient[] => {
  const scalingFactor = newServingSize / originalServingSize;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: ingredient.quantity * scalingFactor,
  }));
};

const GroceryList: React.FC = () => {
const navigate = useNavigate();

  const location = useLocation();
  const { selectedRecipes, servingSize } = location.state || {};
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  const getGroceryList = () => {
    const ingredientsMap: Record<string, { quantity: number; unit: string }> = {};

    selectedRecipes.forEach((id: number) => {
      const recipe = recipes.find((r) => r.id === id);
      if (recipe) {
        const adjustedIngredients = adjustIngredientsForServingSize(recipe.ingredients, recipe.size, servingSize);

        adjustedIngredients.forEach((ingredient) => {
          const key = `${ingredient.item}-${ingredient.unit}`;
          if (ingredientsMap[key]) {
            ingredientsMap[key].quantity += ingredient.quantity;
          } else {
            ingredientsMap[key] = { quantity: ingredient.quantity, unit: ingredient.unit };
          }
        });
      }
    });

    return Object.keys(ingredientsMap).map((key) => {
      const [item] = key.split("-");
      const { quantity, unit } = ingredientsMap[key];
      return { item, quantity, unit };
    });
  };

  const groceryList = getGroceryList();

  
  const handleBack = () => {
    navigate("/menu");
  };

  return (
    <div>
      <div className="container">
      <div className="button-container">
        <button className="nav-button" onClick={handleBack}>
          <span className="arrow-icon">&#8592;</span> {/* Left arrow icon */}
        </button>
      </div>
      <div className="overlay2">
        <h4>Grocery List</h4>
        <ul className="recipe-list4">
        {groceryList.map((ingredient, index) => (
          <li key={index} className="recipe-item4">
            {ingredient.item}: {ingredient.quantity.toFixed(2)} {ingredient.unit}
          </li>
        ))}
      </ul>
      </div>
      
    </div>
    </div>
  );
};

export default GroceryList;

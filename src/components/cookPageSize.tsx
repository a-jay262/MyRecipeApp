import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleRecipe } from "../reducers/recipeSlice";
import { updateRecipeStepsOrder } from "../reducers/recipeSlice";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import React, { useState, useEffect } from "react";
import './cookPage.css';
import './recipe.css';

const CookPageSize: React.FC = () => {
    const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const { id, servingSize } = useParams<{ id: string; servingSize: string }>();

  const dispatch = useDispatch();

  const recipeId = id ? parseInt(id, 10) : undefined;

  const recipe = recipes.find((recipe) => recipe.id === recipeId);

  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(() =>
    recipe ? new Array(recipe.steps.length).fill(false) : []
  );

  interface Ingredients {
    item: string;
    quantity: number;
    unit: string;
  }

  const adjustIngredientsForServingSize = (
    ingredients: Ingredients[],
    originalServingSize: number,
    newServingSize: number
  ): Ingredients[] => {
    const scalingFactor = newServingSize / originalServingSize;
  
    return ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * scalingFactor,
    }));
  };

  const handleStepCheck = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !checkedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };

  const allStepsChecked = checkedSteps.every((checked) => checked);

  const handleCheckButton = () => {
    alert('Congrats! You completed a recipe!');
    if (recipe) {
      dispatch(toggleRecipe({ id: recipe.id }));
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !recipe) {
      return;
    }

    const reorderedSteps = Array.from(recipe.steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);

    dispatch(updateRecipeStepsOrder({ id: recipe.id, reorderedSteps }));
  };

  const [adjustedIngredients, setAdjustedIngredients] = useState(recipe?.ingredients || []);

  useEffect(() => {
    if (recipe && servingSize) {
      const newServingSize = parseInt(servingSize, 10);
      const adjusted = adjustIngredientsForServingSize(recipe.ingredients, recipe.size, newServingSize);
      setAdjustedIngredients(adjusted);
    }
  }, [recipe, servingSize]);

  // Now you can use `id` and `servingSize` in your component
  return (
<div className="page-container">
          <h1>Cook Recipe ID: {id}</h1>
      <p>Actual Recipe Serving Size: {recipe?.size}</p>
      {/* Render your component content based on `id` and `servingSize` */}
      {recipe ? (
        <div>
          <h2>{recipe.name}</h2>
      <h3>Serving Size: {servingSize}</h3>
          
          {/* Display Ingredients */}
          <div className="recipe-ingredients">
            <h4>Ingredients:</h4>
            <ul>
              {adjustedIngredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.unit} - {ingredient.item}
                </li>
              ))}
            </ul>
          </div>
              <h4>Steps to follow:</h4>
          {/* Drag and Drop Steps */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="recipe-steps">
              {(provided) => (
                <ul className="recipe-steps-list" {...provided.droppableProps} ref={provided.innerRef}>
                  {recipe.steps.map((step, index) => (
                    <Draggable key={index} draggableId={`step-${index}`} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="recipe-step-item"
                        >
                          <div className="step-content">
                            <details className="step-details">
                              <summary className="step-summary">{step.step}</summary>
                              <p className="step-description">{step.des}</p>
                            </details>
                          </div>
                          <input
                            type="checkbox"
                            id={`step-${index}`}
                            className="step-checkbox"
                            checked={checkedSteps[index]}
                            onChange={() => handleStepCheck(index)}
                          />
                          <span {...provided.dragHandleProps} className="drag-handle">
                            &#x2630;
                          </span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          {/* Complete Recipe Button */}
          <div className="complete-recipe-container">
            <button
              className="complete-recipe-button"
              type="button"
              disabled={!allStepsChecked}
              onClick={handleCheckButton}
            >
              Complete Recipe
            </button>
          </div>
        </div>
      ) : (
        <div>Recipe not found!</div>
      )}
    </div>
  );
};

export default CookPageSize;

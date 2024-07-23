import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { toggleRecipe, updateRecipeStepsOrder, fetchRecipes } from "../reducers/recipeSlice";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "./cookPage.css";
import { AppDispatch } from "../store/store";

interface Step {
  step: string;
  des: string;
}

interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: number;
  id: number;
  name: string;
  ingredients: Ingredients[];
  steps: Step[];
  checked: boolean;
  cookCount: number;
}

const CookPage: React.FC = () => {
  const navigate = useNavigate();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const dispatch2 = useAppDispatch();
  
  const recipeId = id;


  const recipe = recipes.find((recipe) => recipe._id === recipeId);

  useEffect(() => {
    dispatch2(fetchRecipes());
    alert(`/recipeId/${recipeId}`);
}, [ dispatch2]);

  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(() =>
    recipe ? new Array(recipe.steps.length).fill(false) : []
  );

  const handleStepCheck = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !newCheckedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };

  const allStepsChecked = checkedSteps.every((checked) => checked);

  const handleCheckButton = () => {
    alert("Congrats! You completed a recipe!");
    if (recipe) {
      dispatch2(toggleRecipe(recipe._id)); // Pass the payload as an object
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !recipe) {
      return;
    }

    const reorderedSteps = Array.from(recipe.steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);

    dispatch(updateRecipeStepsOrder({ id: recipe._id, reorderedSteps }));
  };

  const handleBack = () => {
    navigate("/recipe-list");
  };

  return (
    <div>
      <div className="container">
        <div className="button-container">
          <button className="nav-button" onClick={handleBack}>
            <span className="arrow-icon">&#8592;</span> {/* Left arrow icon */}
          </button>
        </div>
        <h4>Cook Recipe</h4>
        <div className="overlay2">
          {recipe ? (
            <div>
              <h4>{recipe.name}</h4>
              <h4>Serving Size: {recipe.size}</h4>

              {/* Display Ingredients */}
              <div className="recipe-ingredients">
                <h4>Ingredients:</h4>
                <ul className="recipe-list4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="recipe-item4">
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
                    <ul
                      className="recipe-steps-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {recipe.steps.map((step, index) => (
                        <Draggable
                          key={index}
                          draggableId={`${recipe._id}-${index}`} // Ensure unique draggableId
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="recipe-step-item"
                            >
                              <div className="step-content">
                                <details className="step-details">
                                  <summary className="step-summary">
                                    {step.step}
                                  </summary>
                                  <p className="step-description">{step.des}</p>
                                </details>
                              </div>
                              <input
                                type="checkbox"
                                id={`${recipe._id}-${index}`}
                                className="step-checkbox"
                                checked={checkedSteps[index]}
                                onChange={() => handleStepCheck(index)}
                                style={{ width: "20px", height: "20px" }}
                              />
                              <span
                                {...provided.dragHandleProps}
                                className="drag-handle"
                              >
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
      </div>
    </div>
  );
};

export default CookPage;

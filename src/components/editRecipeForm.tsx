import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../store/store";
import { editRecipe } from "../reducers/recipeSlice";
import "./recipeForm.css";

interface Step {
  step: string;
  des: string;
}

interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

const EditRecipeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ step: "", des: "" }]);
  const [ingredients, setIngredients] = useState<Ingredients[]>([
    { item: "", quantity: 0, unit: "" },
  ]);
  const [image, setImage] = useState<string | null>(null); 
  const [category, setCategory] = useState("");

  const handleNewUnit = (index: number, value: string) => {
    if (!availableUnits.includes(value)) {
      setAvailableUnits([...availableUnits, value]);
    }
    handleIngredientChange(index, "unit", value);
  };

  const handleNewItem = (index: number, value: string) => {
    if (!availableItems.includes(value)) {
      setAvailableItems([...availableItems, value]);
    }
    handleIngredientChange(index, "item", value);
  };

  const handleItemChange = (index: number, value: string) => {
    const newSteps = [...ingredients];
    newSteps[index].item = value;
    setIngredients(newSteps);
  };
  const handleQuanChange = (index: number, value: number) => {
    const newSteps = [...ingredients];
    newSteps[index].quantity = value;
    setIngredients(newSteps);
  };
  const handleUnitChange = (index: number, value: string) => {
    const newSteps = [...ingredients];
    newSteps[index].unit = value;
    setIngredients(newSteps);
  };

  useEffect(() => {
    const recipeId = id ? parseInt(id, 10) : undefined;
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    if (recipe) {
      setName(recipe.name);
      setIngredients(recipe.ingredients);
      setSteps(recipe.steps);
    }
  }, [id, recipes]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };


  const [availableItems, setAvailableItems] = useState<string[]>([
    "Flour", "Sugar", "Salt", "Eggs", "Butter", "Tomato", "Onion", "Water", "Rice"
  ]);
  const [availableUnits, setAvailableUnits] = useState<string[]>([
    "kg", "g", "lb", "oz", "cup", "tsp", "tbsp",
  ]);

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value,
    };
    setSteps(newSteps);
  };
  

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredients,
    value: string | number
  ) => {
    setIngredients((prevIngredients) => {
      const updatedIngredients = [...prevIngredients];
      const updatedIngredient = { ...updatedIngredients[index] };

      // Use conditional type checking to handle string or number type
      if (typeof value === "string" || typeof value === "number") {
        // Ensure TypeScript knows the type of value correctly
        switch (field) {
          case "item":
            updatedIngredient.item = value as string;
            break;
          case "quantity":
            updatedIngredient.quantity = value as number;
            break;
          case "unit":
            updatedIngredient.unit = value as string;
            break;
          default:
            break;
        }
      }

      updatedIngredients[index] = updatedIngredient;
      return updatedIngredients;
    });
  };

  const handleAddStep = () => {
    setSteps([...steps, { step: "", des: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === undefined) {
      // Handle case where id is undefined
      console.error("Recipe id is undefined. Cannot update recipe.");
      return;
    }
    const recipeId = parseInt(id, 10);
    dispatch(editRecipe({ id: recipeId, name, steps, ingredients, category, image }));
    alert("Recipe Updated Successfully!");
    setName("");
    setIngredients([{ item: "", quantity: 0, unit: "" }]);
    setSteps([{ step: "", des: "" }]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert image to base64 or upload to image hosting service
      // Example using base64 (for demonstration, not recommended for production):
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="background">
      <h1>Edit Recipe:</h1>
      <form className="recipe-form" onSubmit={handleSubmit}>
      <input
          type="text"
          className="recipe-input"
          placeholder="Category"
          value={category}
          onChange={handleCategoryChange}
          required
          style={{ width: '400px' }}
        />
        <input
          type="text"
          className="recipe-input"
          placeholder="Recipe Name"
          value={name}
          onChange={handleNameChange}
          required
          style={{ width: '400px' }}
        />
      <input type="file" onChange={handleImageChange} />
        {ingredients.map((ing, index) => (
          <div key={index} className="step-container">
            <input
              type="text"
              className="recipe-input"
              placeholder={`Ingredient ${index + 1}`}
              value={ing.item}
              list={`item-options-${index}`}
              onChange={(e) => handleNewItem(index, e.target.value)}
              required
            />
            <datalist id={`item-options-${index}`}>
              {availableItems.map((item, i) => (
                <option key={i} value={item} />
              ))}
            </datalist>
          <input
            type="number"
            className="recipe-input"
            placeholder={`Quantity ${index + 1}`}
            value={ing.quantity}
            min = {1}
            onChange={(e) => handleQuanChange(index, Number(e.target.value))}
            required
          />
          <input
              type="text"
              className="recipe-input"
              placeholder={`Unit ${index + 1}`}
              value={ing.unit}
              list={`unit-options-${index}`}
              onChange={(e) => handleNewUnit(index, e.target.value)}
              required
            />
             <datalist id={`unit-options-${index}`}>
              {availableUnits.map((unit, i) => (
                <option key={i} value={unit} />
              ))}
            </datalist>
        </div>
        ))}
        <button
          type="button"
          className="recipe-button3"
          onClick={() =>
            setIngredients([
              ...ingredients,
              { item: "", quantity: 0, unit: "" },
            ])
          }
        >
          Add Ingredient
        </button>
        <br />
        {steps.map((step, index) => (
          <div key={index}>
            <input
              type="text"
              className="recipe-input"
              placeholder={`Step ${index + 1}`}
              value={step.step}
              onChange={(e) => handleStepChange(index, "step", e.target.value)}
              required
              style={{ width: '400px' }}
            />
            <textarea
              className="recipe-input description"
              placeholder={`Description for Step ${index + 1}`}
              value={step.des}
              onChange={(e) => handleStepChange(index, "des", e.target.value)}
              style={{ width: '400px' }}
            />
          </div>
        ))}

        <button
          type="button"
          className="recipe-button3"
          onClick={handleAddStep}
        >
          Add Step
        </button>

        <br />
        <button type="submit" className="recipe-button">
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipeForm;

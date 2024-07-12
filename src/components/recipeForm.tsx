import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addRecipe } from "../reducers/recipeSlice";
import "./recipeForm.css";
import "./recipe.css";

interface Step {
  step: string;
  des: string;
}

interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}


const RecipeForm: React.FC = () => {
  const [name, setName] = useState("");
  const [size, setSize] = useState(5);
  const [size2, setSize2] = useState(5);
  const [steps, setSteps] = useState<Step[]>([{ step: "", des: "" }]);
  const [ingredients, setIngredients] = useState<Ingredients[]>([
    { item: "", quantity: 1, unit: "" },
  ]);

  const dispatch = useDispatch();

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(e.target.value, 10)); 
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

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

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredients,
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value as never;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].step = value;
    setSteps(newSteps);
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

  const handleDesChange = (index: number, value: string) => {
    const newDes = [...steps];
    newDes[index].des = value;
    setSteps(newDes);
  };

  const handleAddStep = () => {
    setSteps([...steps, { step: "", des: "" }]);
  };

  const handleIngredientStep = () => {
    setIngredients([...ingredients, { item: "", quantity: 1, unit: "" }]);
  };

  const [availableItems, setAvailableItems] = useState<string[]>([
    "Flour", "Sugar", "Salt", "Eggs", "Butter", "Tomato", "Onion", "Water", "Rice"
  ]);
  const [availableUnits, setAvailableUnits] = useState<string[]>([
    "kg", "g", "lb", "oz", "cup", "tsp", "tbsp",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      name &&
      steps.every((step) => step.step.trim() !== "" && step.des.trim() !== "") && size !== 0
    ) {
      dispatch(addRecipe({ name,size, ingredients, steps }));
      alert('Recipe Added Successfully!');
      setName("");
      setSize(size2);
      setIngredients([{ item: "", quantity: 1, unit: "" }]);
      setSteps([{ step: "", des: "" }]);
    }
    if(size === 0)
    {
      alert('Enter Valid Serving Size');
    }
  };

  const handleIncrement = () => {
    setSize(prevSize => prevSize + 5);
  };

  const handleDecrement = () => {
    setSize(prevSize => Math.max(prevSize - 5, 5)); // Ensure size doesn't go below 5
  };


  return (
    <div className="background">
      <h1>Add Recipe:</h1>
    <form className="recipe-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="recipe-input"
        id = "name"
        placeholder="Recipe Name"
        value={name}
        onChange={handleNameChange}
        required
        style={{ width: '400px' }}
      />
      <div className="input-container">
      <button type="button" onClick={handleDecrement} className="decrement-button">-5</button>
        <input
          type="number"
          id="servingSize"
          className="recipe-input"
          placeholder="Enter multiples of 5"
          value={size}
          min={5}
          readOnly // Make the input read-only
          required
          style={{ width: '330px' }}
        />
          <button type="button" onClick={handleIncrement} className="increment-button">+5</button>
      </div>
      {ingredients.map((ing, index) => (
        <div key={index} className="step-container">
          <input
              type="text"
              id="ing"
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
            id="quan"
            className="recipe-input"
            placeholder={`Quantity ${index + 1}`}
            value={ing.quantity}
            min = {1}
            onChange={(e) => handleQuanChange(index, Number(e.target.value))}
            required
          />
          <input
              type="text"
              id="unit"
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
        onClick={handleIngredientStep}
      >
        Add Ingredient
      </button>
      <br></br>
      {steps.map((step, index) => (
        <div>
          <input
            type="text"
            className="recipe-input"
            placeholder={`Step ${index + 1}`}
            value={step.step}
            id="step"
            onChange={(e) => handleStepChange(index, e.target.value)}
            required
            style={{ width: '400px' }}
          />
          <textarea
            className="recipe-input description"
            placeholder={`Description for Step ${index + 1}`}
            value={step.des}
            id="des"
            onChange={(e) => handleDesChange(index, e.target.value)}
            style={{ width: '400px' }}
          />
        </div>
      ))}
      <button type="button" className="recipe-button3" onClick={handleAddStep}>
        Add Step
      </button>
      <br />
      <button type="submit" className="recipe-button">
        Add Recipe
      </button>
    </form>
    </div>
  );
};

export default RecipeForm;

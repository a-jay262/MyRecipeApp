import React, { useState, useEffect } from "react";
import { addRecipe } from "../../reducers/recipeSlice";
import "./recipeForm.css";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { addRecipeToIndexedDB } from "../../indexedDB";
import Alert from "./alert";

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
  const [alertText, setAlertText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [imageType, setImageType] = useState("");
    const [imageNull, setImageNull] = useState("");
  const [ingredients, setIngredients] = useState<Ingredients[]>([
    { item: "", quantity: 1, unit: "" },
  ]);
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("showAlert:", showAlert); 
    console.log("AlertText:", alertText); // Check the value after update
    // Check the value after update
  }, [showAlert]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(e.target.value, 10));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    
    if (file) {
      setLoading(true);
      try {
        const options = {
          maxSizeMB: 0.009,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Check online status
        if (navigator.onLine) {
          // Upload image to backend
          const formData = new FormData();
          formData.append("image", compressedFile);

          const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Image upload failed.");
          }

          const data = await response.json();
          setImage(data.filePath); // Set the image URL path from the response
          //alert(`Online Image, ${data.filePath}`);
          console.log("SHOW ALERT 2222", showAlert);
          if (data.filePath != null) {
            //setAlertText(`Online Image`);
            setShowAlert(true);
            setImageType(`Online Image`)
          } else {
            setImageNull(`Image is being null`);
            setShowAlert(true);
          }
        } else {
          // Convert image to Base64 for offline storage
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result as string;
            setImage(base64Image); // Store Base64 image URL
            //alert(`OFFLINE Image, ${base64Image}`);
            if (base64Image != null) {
              setImageType(`OFFLINE Image`);
              setShowAlert(true);
            } else {
              setImageNull(`Image is being null`);
              setShowAlert(true);
            }

            // Save image as part of the recipe in IndexedDB if offline
            const recipeWithImage = {
              ...{ name, size, ingredients, steps, category },
              image: base64Image,
            };
            //await addRecipeToIndexedDB(recipeWithImage); // Use addRecipeToIndexedDB function
          };
          reader.readAsDataURL(compressedFile); // Convert to Base64
        }
      } catch (error) {
        console.error("Error handling image:", error);
      }finally {
        setLoading(false);
        if(imageType ===`OFFLINE Image`)
        {
          if(imageNull === `Image is being null`)
          {
            setAlertText("Offline Image is being null");
          }
          else{
            setAlertText("Offline Image is being added");
          }
        }
        else if(imageType ===`Online Image`){
          if(imageNull === `Image is being null`)
            {
              setAlertText("Online Image is being null");
            }
            else{
              setAlertText("Online Image is being added");
            }
        }
        setShowAlert(true); // Show alert
      }
    }
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
    "Flour",
    "Sugar",
    "Salt",
    "Eggs",
    "Butter",
    "Tomato",
    "Onion",
    "Water",
    "Rice",
  ]);
  const [availableUnits, setAvailableUnits] = useState<string[]>([
    "kg",
    "g",
    "lb",
    "oz",
    "cup",
    "tsp",
    "tbsp",
  ]);

  const handleBack = () => {
    navigate("/menu");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setAlertText("Please enter a recipe name.");
      setShowAlert(true);
      return;
    }

    if (steps.some((step) => !step.step.trim() || !step.des.trim())) {
      //alert("Please complete all steps with valid descriptions.");
      setAlertText("Please complete all steps with valid descriptions.");
      setShowAlert(true);
      return;
    }

    if (size <= 0) {
      //alert("Enter a valid serving size greater than zero.");
      setAlertText("Enter a valid serving size greater than zero.");
      setShowAlert(true);
      return;
    }

    const recipe = { name, size, ingredients, steps, category, image };
    console.log("Recipe to be saved:", recipe); // Add this line to debug

    if (!navigator.onLine) {
      // Store recipe in IndexedDB if offline
      await addRecipeToIndexedDB(recipe);
      //alert("Recipe saved locally. It will be synced when you're back online.");
      setAlertText(
        "Recipe saved locally. It will be synced when you're back online."
      );
      setShowAlert(true);
    } else {
      // Dispatch to Redux store and sync with backend if online
      dispatch(addRecipe(recipe));
      setAlertText("Recipe Added Successfully!");
      setShowAlert(true);
      //alert("Recipe Added Successfully!");
    }

    setName("");
    setSize(1);
    setIngredients([{ item: "", quantity: 1, unit: "" }]);
    setSteps([{ step: "", des: "" }]);
    setCategory("");
    setImage(null);
  };

  const handleIncrement = () => {
    setSize((prevSize) => prevSize + 5);
  };

  const handleDecrement = () => {
    setSize((prevSize) => Math.max(prevSize - 5, 5)); // Ensure size doesn't go below 5
  };

  return (
    <div className="background">
      <div className="button-container">
        <button className="nav-button" onClick={handleBack}>
          <span className="arrow-icon">&#8592;</span> {/* Left arrow icon */}
        </button>
      </div>
      <h3>Add Recipe</h3>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="recipe-input"
          id="category"
          placeholder="Category"
          value={category}
          onChange={handleCategoryChange}
          required
        />
        <input
          type="text"
          className="recipe-input"
          id="name"
          placeholder="Recipe Name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <input type="file" onChange={handleImageChange} />
        <div className="input-container">
          <button
            type="button"
            onClick={handleDecrement}
            className="decrement-button"
          >
            -5
          </button>
          <input
            type="number"
            id="servingSize"
            className="recipe-input"
            placeholder="Enter multiples of 5"
            value={size}
            min={5}
            readOnly // Make the input read-only
            required
          />
          <button
            type="button"
            onClick={handleIncrement}
            className="increment-button"
          >
            +5
          </button>
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
              min={1}
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
            />
            <textarea
              className="recipe-input description"
              placeholder={`Description for Step ${index + 1}`}
              value={step.des}
              id="des"
              onChange={(e) => handleDesChange(index, e.target.value)}
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
          Add Recipe
        </button>
      </form>
      {loading && (
      <div className="loading-overlay">
        <div className="loading-spinner">Loading...</div>
      </div>
    )}
      {showAlert && (
        <Alert
          text={alertText}
          closable={true}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default RecipeForm;

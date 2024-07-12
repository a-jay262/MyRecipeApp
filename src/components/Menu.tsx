import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css'; // CSS file for styling

// Sample images (replace these with actual paths to your images)
import recipesImg from '../assets/recipeBook2.jpg';
import recipeImg2 from '../assets/food1.jpeg';
import recipeImg3 from '../assets/food3.jpg';
import imgg from '../assets/images2.jpeg';
import grocery from '../assets/g2.jpeg';
import edit from '../assets/food2.jpg';
import favoritesImg from '../assets/images.jpeg';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();

  const [size, setSize] = useState(5); // Default to 5
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSize, setNewSize] = useState(size);

  const handleIncrement = () => {
    setNewSize(prevSize => prevSize + 5);
  };

  const handleDecrement = () => {
    setNewSize(prevSize => Math.max(prevSize - 5, 5));
  };

  const handleOpenDialog: React.MouseEventHandler<HTMLDivElement> = () => {
    setNewSize(size); // Reset newSize to current size before opening dialog
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveDialog = () => {
    setSize(newSize); // Update the size state
    setDialogOpen(false);
    navigate(`/recipe-list-size/${newSize}`); // Navigate with newSize
  };

  return (
    <div className="menu-page">
      <h1>Menu</h1>
      <div className="menu-options">
        <div className="menu-option" onClick={() => navigate('/add-recipe')}>
          <img src={recipesImg} alt="Add Recipe" />
          <span>Add Recipe</span>
        </div>
        <div className="menu-option" onClick={() => navigate('/recipe-list')}>
          <img src={edit} alt="Recipes" />
          <span>Recipes</span>
        </div>
        <div className="menu-option" onClick={() => navigate('/edit-list')}>
          <img src={recipeImg2} alt="Edit Recipe" />
          <span>Edit Recipe</span>
        </div>
        <div className="menu-option" onClick={() => navigate('/favorities')}>
          <img src={favoritesImg} alt="Favorites" />
          <span>Favorites</span>
        </div>
        <div className="menu-option" onClick={handleOpenDialog}>
          <img src={recipeImg3} alt="Serving Size" />
          <span>Serving Size</span>
        </div>
        <div className="menu-option" onClick={() => navigate('/grocery-recipe-list')}>
          <img src={grocery} alt="Grocery List" />
          <span>Grocery List</span>
        </div>
        <div className="menu-option" onClick={() => navigate('/most-cooked')}>
          <img src={imgg} alt="Frequently Cooked" />
          <span>Frequently Cooked</span>
        </div>
      </div>
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
                value={newSize}
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

export default MenuPage;

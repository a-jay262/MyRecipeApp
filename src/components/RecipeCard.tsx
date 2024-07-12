import React from 'react';
import './RecipeCard.css'; // Example CSS for RecipeCard styling

interface Recipe {
  id: number;
  title: string;
  image: string;
  favorites: number;
  cooked: number;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={require(`../assets/${recipe.image}`).default} alt={recipe.title} className="recipe-image" />
      <div className="recipe-details">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-stats">Favorited by {recipe.favorites} users</p>
        <p className="recipe-stats">Cooked {recipe.cooked} times</p>
        {/* Additional details or actions */}
      </div>
    </div>
  );
};

export default RecipeCard;

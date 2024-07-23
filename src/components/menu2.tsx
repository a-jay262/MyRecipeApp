import React, { useState, useEffect } from "react";
import "./menu2.css";
import img1 from "../assets/food1.jpeg";
import img2 from "../assets/food2.jpg";
import img3 from "../assets/food3.jpg";
import { useAppDispatch } from '../store/store'; 
import img4 from "../assets/g.jpeg";
import {useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../reducers/recipeSlice';
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { selectFilteredRecipes , fetchRecipes} from '../reducers/recipeSlice';
import { useSelector } from 'react-redux';
import {Recipe } from "../reducers/recipeSlice";
import { RootState } from "../store/store";


const Menu2: React.FC = () => {
  const recipes2 = useSelector((state: RootState) => state.recipes.recipes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // State to track active image
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [recipesWithImages, setRecipesWithImages] = useState<Recipe[]>([]);

  const prevRecipe = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const dispatchApp = useAppDispatch();
  const recipes = useSelector(selectFilteredRecipes);

  const nextRecipe = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };


  const images = [img1, img2];
  const images2 = [img1, img2, img3]; // Include all images

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addRecipeClick=()=>{
    navigate('/add-recipe');
  }

  const handleRecipeList=()=>{
    navigate('/recipe-list');
  }

  const handlegrocery=()=>{
    navigate('/grocery-recipe-list');
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images2.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatchApp(fetchRecipes());
  }, [dispatchApp]);


  useEffect(() => {
    // Filter recipes that have images
    const filteredImagesRecipes = recipes2.filter(recipe => recipe.image);
    setRecipesWithImages(filteredImagesRecipes);

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % filteredImagesRecipes.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [recipes2]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    dispatch(setSearchQuery(query));

    if (query) {
      setFilteredRecipes(recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      ));
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleRecipeClick = (id: number) => {
    // Navigate to the recipe details or handle recipe selection
    navigate(`/cook/${id}`);
    setDropdownVisible(false);
  };

  return (
    <div className="home-page2">
      <div className="header2">
        <div className="profile">
          <img src={img1} alt="Profile" className="profile-image1" />
          <div className="profile-text">
            <span className="text-poppins">Profile</span>
            <span className="profile-score">20</span>
          </div>
        </div>
        <div className="search-row">
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-bar"
              placeholder="Search product here"
              onChange={handleSearch}
            />
            {dropdownVisible && (
              <div className="dropdown-menu">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map(recipe => (
                    <div 
                      key={recipe.id} 
                      className="dropdown-item"
                      onClick={() => handleRecipeClick(recipe.id)}
                    >
                      <img
                src={`http://localhost:5000${recipe.image}`}
                alt={recipe.name}
                className="recipe-image2"
              />
                      <h3>{recipe.name}</h3>
                    </div>
                  ))
                ) : (
                  <p className="dropdown-item">No recipes found</p>
                )}
              </div>
            )}
          </div>
          <button className="filter-button">
            <FaSlidersH className="filter-icon" />
          </button>
        </div>
      </div>

      <section className="category">
        <h2>All</h2>
        <div className="category-images-container">
    <div className="category-images">
      {recipes2.slice(0, 2).map((recipe, index) => (
        recipe.image && (
          <img
            key={index}
            src={`http://localhost:5000${recipe.image}`}
            alt={`Recipe ${index + 1}`}
            className={`profile-image ${
              index === currentIndex ? "active" : ""
            }`}
          />
        )
      ))}
    </div>
        </div>

        <div className="toggle-buttons">
          <button className="arrow-button prev" onClick={prevRecipe}>
            &lt;
          </button>
          <button className="arrow-button next" onClick={nextRecipe}>
            &gt;
          </button>
        </div>
      </section>

      <section className="famous-recipes">
        <h2>Most Famous Recipes</h2>
        <div className="famous-recipes2">
          <div className="image-slider">
          {recipesWithImages.length > 0 && (
              <img
                src={`http://localhost:5000${recipesWithImages[activeIndex]?.image }`}
                alt={`Image ${activeIndex + 1}`}
                className="slide"
              />
            )}
          </div>
        </div>
      </section>

      <button className="recipe-list-button" onClick={handleRecipeList}>
        Recipe List <i className="fas fa-arrow-right"></i>
      </button>

      <footer className="footer">
        <button className="grocery circle-cart-button footer-button" onClick={handlegrocery}>
          <i className="fas fa-shopping-cart"></i>
        </button>

        <button className="add-recipe circle-plus-button footer-button" onClick={addRecipeClick}>
          <i className="fas fa-plus"></i>
        </button>
      </footer>
    </div>
  );
};

export default Menu2;

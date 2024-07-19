import React, { useState, useEffect } from "react";
import "./menu2.css";
import img1 from "../assets/food1.jpeg";
import img2 from "../assets/food2.jpg";
import img3 from "../assets/food3.jpg";
import img4 from "../assets/g.jpeg";
import {useNavigate} from "react-router-dom";

import { FaSearch, FaSlidersH } from "react-icons/fa";

const Menu2: React.FC = () => {

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [img1, img2];
  const images2 = [img1, img2, img3]; // Include all images
  // Include all images

  const addRecipeClick=()=>{
    navigate('/add-recipe');
  }

  const handleRecipeList=()=>{
    navigate('/recipe-list');
  }

  const handlegrocery=()=>{
    navigate('/grocery-recipe-list');
  }

  const prevRecipe = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextRecipe = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const [activeIndex, setActiveIndex] = useState(0); // State to track active image

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images2.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
            />
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
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Recipe"
                className={`profile-image ${
                  index === currentIndex ? "active" : ""
                }`}
              />
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
            <img
              src={images2[activeIndex]}
              alt={`Image ${activeIndex + 1}`}
              className="slide"
            />
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
  <i className="fas fa-plus"></i>  {/* Replace with your font icon library's plus sign code */}
</button>
      </footer>
    </div>
  );
};

export default Menu2;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import logo from "../../assets/logo4.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1 className="app-name">OMI RECIPE</h1>
        <img src={logo} alt="Omi Recipe Logo" className="logo" />
      </header>
      <div className="content2">
        <button onClick={handleGetStarted} className="signup-button">
          Sign Up
        </button>
        <div className="sign-in-link">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// src/components/Signup.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup: React.FC = () => {
  const history = useNavigate();
  const [username, setUsername] = useState<string>("");

  const handleSignup = () => {
    history("/menu");
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="button" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
      <p className="signup-link">
        Already have an account? <a href="/signup">Log In</a>
      </p>
    </div>
  );
};

export default Signup;

// src/components/Signup.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LogIn: React.FC = () => {
  const history = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    history("/menu");
    // Add logic to handle signup with username and password
  };

  return (
    <div className="signup-container">
      <h2>Sign In</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>
          Sign In
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/login">SignUp</a>
      </p>
    </div>
  );
};

export default LogIn;

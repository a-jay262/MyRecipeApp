import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Alert from "../Recipe/alert";

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [alertText, setAlertText] = useState("");
  const [showAlert, setShowAlert] = useState(false);


  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Redirect to menu on successful login
        setAlertText("You're successfully signed in");
        //setAlertText("Please complete all steps with valid descriptions.");
        console.log("Signed in");
        setShowAlert(true);
        navigate("/menu");
      } else {
        alert(response.data.message);// Show error message
      }
    } catch (error) {
      setAlertText("An error occurred during login. Please try again.");
      //setAlertText("Please complete all steps with valid descriptions.");
      setShowAlert(true);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign In</h2>
      <form>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      {error && <p className="error-message">{error}</p>}
      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
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

export default LogIn;

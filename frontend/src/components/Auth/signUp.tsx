// src/components/Signup.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Signup.css";
import Alert from "../Recipe/alert";


const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60); // 1 minute countdown
  const [alertText, setAlertText] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showOtpDialog && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setShowOtpDialog(false); // Close dialog when time is up
      alert("OTP expired. Please request a new OTP.");
    }

    return () => clearInterval(timer);
  }, [showOtpDialog, timeLeft]);

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        username,
        email,
        password,
      });
  
      if (response.data.success) {
        setAlertText(response.data.message);
        setShowAlert(true);
        setUserId(response.data.userId); // Store the userId for OTP verification
        setShowOtpDialog(true); // Show the OTP dialog
        setTimeLeft(60); // Start the countdown timer
      } else {
        setAlertText(response.data.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Signup error", error);
    }
  };
  

  const handleOtpVerify = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/verify", {
        userId,
        otp,
      });
      if (response.data.success) {
        setAlertText(response.data.message);
        setShowAlert(true);
        window.location.href = "/menu"; // Redirect to another page
      } else {
        setAlertText(response.data.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("OTP verification error", error);
    }
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
        <label htmlFor="email">Email:</label>
        <input
          type="email"
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
        <button type="button" onClick={handleSignup}>
          Sign Up
        </button>
      </form>

      {showOtpDialog && (
        <div className="otp-dialog">
          <h3>Enter OTP</h3>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="button"
            onClick={handleOtpVerify}
            disabled={timeLeft <= 0}
          >
            Verify OTP
          </button>
          <br></br>
          <div>
            {timeLeft > 0 ? `Time left: ${timeLeft}s` : "OTP expired"}
          </div>
        </div>
      )}

      <p className="signup-link">
        Already have an account? <a href="/login">Sign In</a>
      </p>
    </div>
  );
};

export default Signup;

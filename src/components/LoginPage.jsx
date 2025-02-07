import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Make sure to import the CSS
import logo from"../logo.png" 


const api = axios.create({
  baseURL: "https://api.satvikraas.com",
  
  withCredentials: true,
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 302;
  },
});


const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post(
        // "https://api.satvikraas.com/api/auth/login",
        "/api/auth/adminlogin",
       
        null,
        {
          params: {
            email: email,
            password: password,
          },
        }
      );

      // Store tokens in session storage
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);

      // Navigate to dashboard on successful login
      navigate("/adminDashBoard");
    } catch (error) {
      console.error("Error logging in:", error);
      // Set error message to display to user
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <img src={logo} alt="" />
      <h1>Admin Login</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import { login } from "../api"; // API call
import toast from "react-hot-toast";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(username, password);
      toast.success("Login successful!");
      onLogin(data.token);
    } catch {
      toast.error("Invalid username/password");
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2>🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

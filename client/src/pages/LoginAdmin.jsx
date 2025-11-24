import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/admin/login", {
        email,
        password,
      });

      login(res.data.token); // save token
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Login</h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
}

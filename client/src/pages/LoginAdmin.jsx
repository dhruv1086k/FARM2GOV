import React, { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/admin/login", {
        email,
        password,
      });

      login(res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-green-100 shadow-2xl rounded-3xl p-10">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-green-800 text-center tracking-tight">
          Admin Login
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Secure access to the Farm2Gov admin panel.
        </p>

        {/* Error Message */}
        {error && (
          <p className="mt-5 text-center bg-red-100 text-red-700 font-medium py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium">Admin Email</label>
            <input
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-green-600 outline-none transition shadow-sm"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium">Admin Password</label>
            <input
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-green-600 outline-none transition shadow-sm"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            className={`w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-lg
              transition text-white flex items-center justify-center gap-3 
              ${
                loading
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

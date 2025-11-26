// client/src/pages/LoginFarmer.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginFarmer() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/farmer/login", { phone, password });

      login(res.data.token);
      navigate("/farmer/dashboard");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Your account has been deactivated. Contact support.");
      } else {
        setError("Invalid phone or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-green-100">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-green-800 tracking-tight">
            Farmer Login
          </h2>
          <p className="text-gray-600 mt-2">
            Welcome back! Please login to continue.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-green-600 focus:border-green-600 
              outline-none transition-all"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-green-600 focus:border-green-600 
              outline-none transition-all"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button with Loader */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg 
              transition-all flex items-center justify-center gap-3
              ${
                loading
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              }`}
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

        {/* Footer Links */}
        <div className="mt-6 flex justify-between items-center">
          <Link
            to="/farmer/forgot-password"
            className="text-sm text-green-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center mt-8 text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/farmer/signup"
            className="text-green-700 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

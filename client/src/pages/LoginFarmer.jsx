import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginFarmer() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/farmer/login", { phone, password });

      // If login successful → save token & redirect
      login(res.data.token);
      navigate("/farmer/dashboard");
    } catch (err) {
      // Backend sends 403 if deactivated
      if (err.response?.status === 403) {
        setError("Your account has been deactivated. Contact support.");
      } else {
        setError("Invalid phone or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F5E8] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-green-800 text-center">
          Farmer Login
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Welcome back! Please login to continue.
        </p>

        {error && (
          <p className="text-red-600 text-center mt-3 font-medium">{error}</p>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-700">
          Don’t have an account?{" "}
          <Link to="/farmer/signup" className="text-green-700 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

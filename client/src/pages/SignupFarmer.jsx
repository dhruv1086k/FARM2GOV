import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignupFarmer() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("hi");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await API.post("/auth/farmer/signup", {
        name,
        phone,
        password,
        state,
        email,
        language,
      });

      setSuccess(true);
      setTimeout(() => navigate("/farmer/login"), 2000);
    } catch (err) {
      setError("Signup failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-green-100">
        
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-green-800 text-center tracking-tight">
          Farmer Registration
        </h2>

        {error && (
          <p className="text-red-600 text-center mt-4 bg-red-100 p-3 rounded-lg font-medium">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-center mt-4 bg-green-100 p-3 rounded-lg font-medium">
            Signup successful! Redirecting...
          </p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all outline-none"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all outline-none"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Phone Number</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all outline-none"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">State</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all outline-none"
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter your state"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all outline-none"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
          </div>

          {/* Register Button */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 ${
              loading ? "bg-green-500 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-gray-700">
          Already have an account?{" "}
          <Link to="/farmer/login" className="text-green-700 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

// client/src/pages/ResetPasswordWithOtp.jsx
import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPasswordWithOtp() {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!identifier || !otp)
      return setStatus({ type: "error", msg: "Enter identifier and OTP" });

    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { identifier, otp });
      setStage(2);
      setStatus({ type: "success", msg: "OTP valid. Enter new password." });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Invalid OTP or expired",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!newPassword)
      return setStatus({ type: "error", msg: "Enter new password" });

    setLoading(true);
    try {
      await API.post("/auth/reset-password", { identifier, otp, newPassword });
      setStatus({
        type: "success",
        msg: "Password updated. Redirecting to login...",
      });
      setTimeout(() => navigate("/farmer/login"), 1200);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F5E8] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-green-800 text-center">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Use the OTP we sent to your email to reset password.
        </p>

        {status && (
          <p
            className={`mt-4 text-center ${
              status.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {status.msg}
          </p>
        )}

        {stage === 1 && (
          <form className="mt-6 space-y-5" onSubmit={handleVerifyOtp}>
            <div>
              <label className="text-gray-700 font-medium">
                Email or Phone
              </label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">OTP</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white ${
                loading ? "bg-green-400" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {stage === 2 && (
          <form className="mt-6 space-y-5" onSubmit={handleReset}>
            <div>
              <label className="text-gray-700 font-medium">New Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white ${
                loading ? "bg-green-400" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Setting..." : "Set New Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-700">
          <Link to="/farmer/login" className="text-green-700 font-semibold">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

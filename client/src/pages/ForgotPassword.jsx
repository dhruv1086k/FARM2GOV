// client/src/pages/ForgotPassword.jsx
import { useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // STEP 1 = Send OTP, STEP 2 = Verify & Reset
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ----------------------- STEP 1 → SEND OTP ----------------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!identifier)
      return setStatus({ type: "error", msg: "Enter email or phone" });

    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { identifier });

      setStatus({
        type: "success",
        msg: "If an account exists, OTP has been sent to the registered email.",
      });

      setStep(2); // move to OTP screen
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- STEP 2 → RESET PASSWORD ----------------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!otp || !newPassword)
      return setStatus({ type: "error", msg: "Enter OTP & new password" });

    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        identifier,
        otp,
        newPassword,
      });

      setStatus({
        type: "success",
        msg: "Password reset successful! You can now login.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-green-100 shadow-2xl rounded-3xl p-10">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-green-800 text-center tracking-tight">
          Forgot Password
        </h2>

        {/* Status Message */}
        {status && (
          <p
            className={`mt-5 text-center font-medium p-3 rounded-lg ${
              status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status.msg}
          </p>
        )}

        {/* ------------------- STEP 1: SEND OTP ------------------- */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">
                Email or Phone Number
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl
                           focus:ring-2 focus:ring-green-600 outline-none transition-all"
                placeholder="email@example.com or 9123456789"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            {/* SEND OTP BUTTON WITH LOADER */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all flex items-center justify-center gap-3 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending OTP...
                </>
              ) : (
                "Send Reset OTP"
              )}
            </button>
          </form>
        )}

        {/* ------------------- STEP 2: VERIFY OTP + RESET ------------------- */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">
                Enter OTP sent to your email
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl
                           focus:ring-2 focus:ring-green-600 outline-none transition-all"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium">New Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-xl
                           focus:ring-2 focus:ring-green-600 outline-none transition-all"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {/* RESET BUTTON WITH LOADER */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all flex items-center justify-center gap-3 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <p
              className="text-green-700 text-center font-medium cursor-pointer hover:underline"
              onClick={() => setStep(1)}
            >
              Resend OTP
            </p>
          </form>
        )}

        {/* Back to Login */}
        <p className="text-center mt-8 text-gray-700">
          <Link
            to="/farmer/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

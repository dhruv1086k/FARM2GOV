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

  /* -----------------------------------------------------
      STEP 1 -> SEND OTP
  ------------------------------------------------------ */
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

      setStep(2); // 👉 Move to OTP step
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
      STEP 2 -> VERIFY OTP + RESET PASSWORD
  ------------------------------------------------------ */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!otp || !newPassword)
      return setStatus({ type: "error", msg: "Enter OTP & new password" });

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
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
    <div className="min-h-screen flex items-center justify-center bg-[#F3F5E8] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-green-800 text-center">
          Forgot Password
        </h2>

        {status && (
          <p
            className={`mt-4 text-center ${
              status.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {status.msg}
          </p>
        )}

        {/* -----------------------------------------------------
            STEP 1 UI
        ------------------------------------------------------ */}
        {step === 1 && (
          <form className="mt-6 space-y-5" onSubmit={handleSendOtp}>
            <div>
              <label className="text-gray-700 font-medium">
                Email or Phone Number
              </label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="email@example.com or 9123456789"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition ${
                loading ? "bg-green-400" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Sending..." : "Send Reset OTP"}
            </button>
          </form>
        )}

        {/* -----------------------------------------------------
            STEP 2 UI — ENTER OTP + NEW PASSWORD
        ------------------------------------------------------ */}
        {step === 2 && (
          <form className="mt-6 space-y-5" onSubmit={handleResetPassword}>
            <div>
              <label className="text-gray-700 font-medium">
                Enter OTP sent to your email
              </label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">New Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition ${
                loading ? "bg-green-400" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Please wait..." : "Reset Password"}
            </button>

            <p
              className="text-green-700 text-center cursor-pointer"
              onClick={() => setStep(1)}
            >
              Resend OTP
            </p>
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

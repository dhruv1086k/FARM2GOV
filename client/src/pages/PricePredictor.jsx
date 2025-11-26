import { useState } from "react";
import API from "../api/axios";

export default function PricePredictor() {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const predict = async () => {
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const artificialDelay = 2500 + Math.random() * 1000;

      const apiCall = API.post("/predict/price", {
        crop: crop.trim(),
        state: state.trim(),
        season: season.trim(),
      });

      const [res] = await Promise.all([apiCall, sleep(artificialDelay)]);
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError({
          message: err.response.data.error,
          availableCrops: err.response.data.availableCrops,
        });
      } else if (err.response?.status === 400) {
        setError({ message: err.response.data.error });
      } else {
        setError({ message: "Failed to get prediction. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  return (
    <div className="min-h-screen flex justify-center px-4 py-14 bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg border border-green-100 shadow-2xl rounded-3xl p-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-green-800 tracking-tight">
            🌾 AI Price Predictor
          </h2>
          <p className="text-gray-700 mt-3 text-lg">
            Get accurate AI-powered crop price predictions.
          </p>
        </div>

        {/* Inputs */}
        <div className="mt-10 space-y-7">
          <InputField
            label="Crop Name"
            placeholder="e.g., rice, wheat, maize"
            value={crop}
            onChange={setCrop}
          />

          <InputField
            label="State"
            placeholder="e.g., Punjab, Maharashtra"
            value={state}
            onChange={setState}
          />

          <InputField
            label="Season"
            placeholder="Kharif, Rabi, or Zaid"
            value={season}
            onChange={setSeason}
          />

          {/* Predict Button */}
          <button
            onClick={predict}
            disabled={loading || !crop || !state || !season}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg flex items-center justify-center transition-all shadow-md ${
              loading || !crop || !state || !season
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Predicting...
              </div>
            ) : (
              "Predict Price"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
            <p className="text-red-700 font-semibold text-lg">❌ Error</p>
            <p className="text-red-600 mt-2">{error.message}</p>

            {error.availableCrops && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Available crops:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {error.availableCrops.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-7 shadow-sm">
            <h3 className="text-2xl font-bold text-green-800">
              🪙 Prediction Result
            </h3>

            <div className="mt-5 space-y-2 text-gray-700">
              <p className="text-xl">
                Predicted Price:{" "}
                <span className="text-green-900 font-extrabold">
                  ₹{result.predictedPrice}
                </span>{" "}
                /quintal
              </p>
              <p className="text-sm text-gray-500">Source: {result.source}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   InputField Component
---------------------------------------------------------- */

function InputField({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        className="w-full p-3 border border-gray-300 rounded-xl bg-white 
                   focus:ring-2 focus:ring-green-600 focus:border-green-600
                   outline-none transition-all shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

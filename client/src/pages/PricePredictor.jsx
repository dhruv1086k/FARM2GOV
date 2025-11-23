import { useState } from "react";
import API from "../api/axios";

export default function PricePredictor() {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [season, setSeason] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = async () => {
    // Clear previous results
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      console.log("🔄 Making API call...");
      const startTime = Date.now();

      const res = await API.post("/predict/price", {
        crop: crop.trim(),
        state: state.trim(),
        season: season.trim(),
      });

      const endTime = Date.now();
      console.log(`✅ API responded in ${endTime - startTime}ms`);
      console.log("Response:", res.data);

      setResult(res.data);
    } catch (err) {
      console.error("❌ API Error:", err);

      // Handle different error types
      if (err.response?.status === 404) {
        const errorMsg = err.response.data.error;
        const availableCrops = err.response.data.availableCrops;
        setError({
          message: errorMsg,
          availableCrops: availableCrops,
        });
      } else if (err.response?.status === 400) {
        setError({
          message: err.response.data.error,
        });
      } else {
        setError({
          message: "Failed to get prediction. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5E8] flex justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-green-800 text-center">
          🌾 AI Price Predictor
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Get AI-powered crop price predictions instantly.
        </p>

        {/* Input Fields */}
        <div className="mt-8 space-y-5">
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
            className={`w-full py-3 rounded-lg text-white font-semibold transition text-lg ${
              loading || !crop || !state || !season
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-semibold">❌ Error</p>
            <p className="text-red-600 mt-2">{error.message}</p>

            {error.availableCrops && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700">
                  Available crops:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {error.availableCrops.join(", ")}
                </p>
              </div>
            )}

            {error.availableStates && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700">
                  Available states:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {error.availableStates.join(", ")}
                </p>
              </div>
            )}

            {error.validSeasons && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700">
                  Valid seasons:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {error.validSeasons.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-10 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800">
              ✅ Prediction Result
            </h3>

            <div className="mt-4 space-y-2 text-gray-700">
              <p className="text-lg">
                Predicted Price:{" "}
                <span className="font-bold text-green-900">
                  ₹{result.predictedPrice}
                </span>
                /per quintal
              </p>
              <p className="text-sm text-gray-500">Source: {result.source}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable InputComponent */
function InputField({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

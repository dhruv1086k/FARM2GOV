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
      // Simulate loading time ⏳
      const artificialDelay = 2500 + Math.random() * 1000; // 2.5–3.5 sec delay
      console.log("⏳ Waiting artificial delay:", artificialDelay);

      const apiCall = API.post("/predict/price", {
        crop: crop.trim(),
        state: state.trim(),
        season: season.trim(),
      });

      const [res] = await Promise.all([apiCall, sleep(artificialDelay)]);

      setResult(res.data);
    } catch (err) {
      console.error("❌ API Error:", err);

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

  return (
    <div className="min-h-screen bg-[#F3F5E8] flex justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-green-800 text-center">
          🌾 AI Price Predictor
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Get AI-powered crop price predictions instantly.
        </p>

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

          <button
            onClick={predict}
            disabled={loading || !crop || !state || !season}
            className={`w-full py-3 rounded-lg text-white font-semibold transition text-lg flex items-center justify-center ${
              loading || !crop || !state || !season
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Predicting...
              </div>
            ) : (
              "Predict Price"
            )}
          </button>
        </div>

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
          </div>
        )}

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

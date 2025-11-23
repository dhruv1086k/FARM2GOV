import {
  callAIPricePredictor,
  getAvailableCrops,
  getAvailableStates,
} from "../utils/aiClient.js";

export const predictPrice = async (req, res) => {
  try {
    const { crop, state, season } = req.body;

    console.log("📥 Request received:", { crop, state, season });

    if (!crop || !state || !season) {
      return res.status(400).json({
        error: "Missing fields: crop, state, season required",
      });
    }

    const prompt = `You are an agriculture market price expert in India.
Predict a realistic wholesale price (per quintal in INR) for:
Crop: ${crop}
State: ${state}
Season: ${season}

Consider current market trends and seasonal variations.
Respond ONLY with valid JSON (no markdown, no extra text):
{
  "predictedPrice": <number>
}`;

    console.log("🤖 Calling AI predictor...");

    try {
      const aiResp = await callAIPricePredictor(prompt);

      if (aiResp?.predictedPrice) {
        console.log("✅ AI prediction successful:", aiResp.predictedPrice);
        return res.json({
          predictedPrice: aiResp.predictedPrice,
          source: "gemini",
          crop,
          state,
          season,
        });
      }
    } catch (err) {
      console.error("❌ AI predictor failed:", err.message);

      // Check if it's a crop not found error
      if (err.message.includes("Crop") && err.message.includes("not found")) {
        return res.status(404).json({
          error: err.message,
          availableCrops: getAvailableCrops(),
        });
      }

      // Check if it's a state not found error
      if (err.message.includes("State") && err.message.includes("not found")) {
        return res.status(404).json({
          error: err.message,
          availableStates: getAvailableStates(),
        });
      }

      // Check if it's an invalid season error
      if (err.message.includes("Invalid season")) {
        return res.status(400).json({
          error: err.message,
          validSeasons: ["Kharif", "Rabi", "Zaid"],
        });
      }

      // Generic error fallback
      return res.status(500).json({
        error: "Price prediction failed",
        details: err.message,
      });
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

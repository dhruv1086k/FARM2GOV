// server/controllers/predictController.js
import { callAIPricePredictor } from "../utils/aiClient.js";

export const predictPrice = async (req, res) => {
  const { crop, state, season, soilType, weather, quantity } = req.body;

  if (!crop || !state || !season) {
    return res.status(400).json({ error: "Missing required fields: crop, state, season" });
  }

  console.log("📥 Price Prediction Request:", { crop, state, season });

  // callAIPricePredictor NEVER throws — it has internal fallback
  const result = await callAIPricePredictor({ crop, state, season, soilType, weather, quantity });

  console.log(`✅ Prediction (${result.source}): ₹${result.predictedPrice}`);
  return res.json({ ...result, crop, state, season });
};

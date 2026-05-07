// server/controllers/diseaseController.js
import { callDiseaseDetection } from "../utils/aiClient.js";

export const detectDisease = async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "Image data is required" });

  console.log("🔬 Disease Detection Request — calling Gemini Vision...");

  const base64Data = imageBase64.includes("base64,")
    ? imageBase64.split("base64,")[1]
    : imageBase64;

  // callDiseaseDetection NEVER throws — has internal fallback
  const result = await callDiseaseDetection(base64Data, mimeType || "image/jpeg");

  console.log(`✅ Detected (${result.source}): ${result.diseaseName} (${result.confidence}%)`);
  return res.json({ success: true, ...result });
};

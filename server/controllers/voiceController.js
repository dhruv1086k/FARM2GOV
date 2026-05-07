// server/controllers/voiceController.js
import { callVoiceAI } from "../utils/aiClient.js";

export const askVoiceAI = async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) return res.status(400).json({ error: "Question is required" });

  console.log("🎤 Voice AI Query:", question.substring(0, 80));

  // callVoiceAI NEVER throws — has internal fallback
  const result = await callVoiceAI(question.trim());
  return res.json({ success: true, question, ...result });
};

// server/routes/voiceRoutes.js
import express from "express";
import { askVoiceAI } from "../controllers/voiceController.js";

const router = express.Router();

router.post("/ask", askVoiceAI);

export default router;

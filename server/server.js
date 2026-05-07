// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import predictRoutes from "./routes/predictRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import voiceRoutes from "./routes/voiceRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";

dotenv.config();

const app = express();

// ─── CORS ─────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "https://farm-2-gov.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" })); // allow base64 images in JSON
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ─── DATABASE ─────────────────────────────────────────────
connectDB();

// ─── ROUTES ───────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));
app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/voice", voiceRoutes);       // NEW: Voice AI
app.use("/api/disease", diseaseRoutes);   // NEW: Disease Detection

// ─── START ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

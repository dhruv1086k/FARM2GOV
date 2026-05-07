// server/routes/cropRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllCrops,
  getMyCrops,
  createCrop,
  updateCrop,
  deleteCrop,
} from "../controllers/cropController.js";

const router = express.Router();

// ─── PUBLIC ────────────────────────────────────────────────
// GET /api/crops  — marketplace listing (with search/filter/pagination)
router.get("/", getAllCrops);

// ─── PROTECTED (farmer) ────────────────────────────────────
// GET /api/crops/my  — farmer's own listings
router.get("/my", auth, getMyCrops);

// POST /api/crops  — create a new listing
router.post("/", auth, createCrop);

// PUT /api/crops/:id  — update a listing
router.put("/:id", auth, updateCrop);

// DELETE /api/crops/:id  — delete a listing
router.delete("/:id", auth, deleteCrop);

export default router;

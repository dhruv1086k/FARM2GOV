import express from "express";
import auth from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";
import {
  getDashboardStats,
  getFarmers,
  toggleFarmerActive,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", auth, adminOnly, getDashboardStats);
router.get("/farmers", auth, adminOnly, getFarmers);
router.post("/farmers/:id/toggle-active", auth, adminOnly, toggleFarmerActive);

export default router;

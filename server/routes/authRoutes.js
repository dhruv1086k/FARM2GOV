import express from "express";
import {
  farmerSignup,
  farmerLogin,
  forgotPassword,
  verifyOtp,
  resetPasswordWithOtp,
  adminLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/farmer/signup", farmerSignup);
router.post("/farmer/login", farmerLogin);

// NEW OTP ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordWithOtp);

router.post("/admin/login", adminLogin);

export default router;

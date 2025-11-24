import express from "express";
import {
  createPolicy,
  getPolicies,
  updatePolicy,
  deletePolicy,
} from "../controllers/policyController.js";
import auth from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

// PUBLIC
router.get("/", getPolicies);

// ADMIN PROTECTED
router.post("/", auth, adminOnly, createPolicy);
router.put("/:id", auth, adminOnly, updatePolicy);
router.delete("/:id", auth, adminOnly, deletePolicy);

export default router;

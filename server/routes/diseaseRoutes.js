// server/routes/diseaseRoutes.js
import express from "express";
import { detectDisease } from "../controllers/diseaseController.js";

const router = express.Router();

router.post("/detect", detectDisease);

export default router;

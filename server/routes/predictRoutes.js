import express from "express";
import { predictPrice } from "../controllers/predictController.js";

const router = express.Router();

router.post("/price", predictPrice);

export default router;

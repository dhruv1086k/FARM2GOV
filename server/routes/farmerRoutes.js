import express from 'express';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/admin.js';
import { getFarmerProfile, updateFarmer, getAllFarmers } from '../controllers/farmerController.js';

const router = express.Router();

// Farmer routes
router.get('/me', auth, getFarmerProfile);
router.put('/me', auth, updateFarmer);

// Admin routes
router.get('/all', auth, adminOnly, getAllFarmers);

export default router;

import express from 'express';
import { farmerSignup, farmerLogin, adminLogin } from '../controllers/authController.js';


const router = express.Router();
router.post('/farmer/signup', farmerSignup);
router.post('/farmer/login', farmerLogin);
router.post('/admin/login', adminLogin);


export default router;
import express from 'express';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/admin.js';
import multer from 'multer';
import { createPolicy, getPolicies, updatePolicy, deletePolicy } from '../controllers/policyController.js';


const router = express.Router();
const upload = multer(); // we accept text in body so multer is optional here


router.get('/', auth, getPolicies); // any authenticated user


// Admin CRUD
router.post('/', auth, adminOnly, createPolicy);
router.put('/:id', auth, adminOnly, updatePolicy);
router.delete('/:id', auth, adminOnly, deletePolicy);


export default router;
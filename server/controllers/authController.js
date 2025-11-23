import Farmer from '../models/Farmer.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const signToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });


// =======================
// FARMER SIGNUP
// =======================
export const farmerSignup = async (req, res) => {
    console.log("SIGNUP BODY:", req.body);

    try {
        const { name, phone, password, state, email, language } = req.body;

        // Basic required fields
        if (!name || !phone || !password || !state) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existing = await Farmer.findOne({ phone });
        if (existing) {
            return res.status(400).json({ message: 'Farmer with this phone already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        // Store email/language safely
        const farmer = new Farmer({
            name,
            phone,
            password: hashed,
            state,
            email: email || null,       // optional
            language: language || "en"  // default value
        });

        await farmer.save();

        const token = signToken({ id: farmer._id, role: 'farmer' });

        res.json({
            token,
            farmer: {
                id: farmer._id,
                name: farmer.name
            }
        });

    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


// =======================
// FARMER LOGIN
// =======================
export const farmerLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const farmer = await Farmer.findOne({ phone });
        if (!farmer) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const ok = await bcrypt.compare(password, farmer.password);
        if (!ok) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: farmer._id, role: 'farmer' });

        res.json({
            token,
            farmer: {
                id: farmer._id,
                name: farmer.name
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


// =======================
// ADMIN LOGIN
// =======================
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: admin._id, role: 'admin' });

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });

    } catch (err) {
        console.error("ADMIN LOGIN ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';


const seed = async () => {
    await connectDB();
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const pass = process.env.DEFAULT_ADMIN_PASSWORD;
    const exists = await Admin.findOne({ email });
    if (exists) {
        console.log('Admin exists');
        process.exit(0);
    }
    const hashed = await bcrypt.hash(pass, 10);
    const admin = new Admin({ email, password: hashed });
    await admin.save();
    console.log('Admin created:', email);
    process.exit(0);
};


seed();
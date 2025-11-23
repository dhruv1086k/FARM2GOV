import mongoose from 'mongoose';


const CropSchema = new mongoose.Schema({
    name: { type: String },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' }
});


const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    state: { type: String },
    language: { type: String, default: 'en' },
    crops: [CropSchema],
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Farmer', FarmerSchema);
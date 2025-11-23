import mongoose from 'mongoose';


const PolicySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    uploadedAt: { type: Date, default: Date.now }
});


export default mongoose.model('Policy', PolicySchema);
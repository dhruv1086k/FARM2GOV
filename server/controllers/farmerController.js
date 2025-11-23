import Farmer from '../models/Farmer.js';


export const getAllFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find().select('-password');
        res.json(farmers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getFarmerProfile = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.user.id).select('-password');
        if (!farmer) return res.status(404).json({ message: 'Not found' });
        res.json(farmer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const updateFarmer = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // handle password change separately
        const farmer = await Farmer.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json(farmer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
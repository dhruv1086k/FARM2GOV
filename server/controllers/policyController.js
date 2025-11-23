import Policy from '../models/Policy.js';


export const createPolicy = async (req, res) => {
    try {
        const { title, content } = req.body;
        const policy = new Policy({ title, content, uploadedBy: req.user.id });
        await policy.save();
        res.json(policy);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getPolicies = async (req, res) => {
    try {
        const policies = await Policy.find().populate('uploadedBy', 'email');
        res.json(policies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await Policy.findByIdAndUpdate(id, req.body, { new: true });
        res.json(policy);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        await Policy.findByIdAndDelete(id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
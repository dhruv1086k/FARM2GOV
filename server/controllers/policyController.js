import Policy from "../models/Policy.js";

// CREATE POLICY
export const createPolicy = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const policy = await Policy.create({ title, content });

    res.json({ success: true, policy });
  } catch (err) {
    console.error("CREATE POLICY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL POLICIES (Public)
export const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.json(policies);
  } catch (err) {
    console.error("GET POLICIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE POLICY
export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!policy) return res.status(404).json({ message: "Policy not found" });

    res.json({ success: true, policy });
  } catch (err) {
    console.error("UPDATE POLICY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE POLICY
export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findByIdAndDelete(id);

    if (!policy) return res.status(404).json({ message: "Policy not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE POLICY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

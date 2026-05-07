import Farmer from "../models/Farmer.js";
import Policy from "../models/Policy.js";
import Crop from "../models/Crop.js";

// ======================
// ADMIN DASHBOARD STATS
// ======================
export const getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments();
    const totalPolicies = await Policy.countDocuments();
    const totalCrops = await Crop.countDocuments();

    // Active today = farmers who logged in within last 24h
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await Farmer.countDocuments({
      lastLogin: { $gte: dayAgo },
    });

    // Signups grouped by day for last 30 days
    const thirty = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const signups = await Farmer.aggregate([
      { $match: { createdAt: { $gte: thirty } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalFarmers,
      totalPolicies,
      totalCrops,
      activeToday,
      signups,
    });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// ADMIN FARMERS TABLE
// ======================
export const getFarmers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const search = req.query.search || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // 🔥 FIX: include "active" field explicitly
    const [total, farmers] = await Promise.all([
      Farmer.countDocuments(filter),
      Farmer.find(filter)
        .select("name phone email state active createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({ total, page, limit, farmers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// TOGGLE FARMER ACTIVE
// ======================
export const toggleFarmerActive = async (req, res) => {
  try {
    const id = req.params.id;

    const farmer = await Farmer.findById(id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const newStatus = !farmer.active;

    await Farmer.updateOne({ _id: id }, { active: newStatus });

    res.json({
      success: true,
      active: newStatus,
    });
  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

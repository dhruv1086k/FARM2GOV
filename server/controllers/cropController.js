// server/controllers/cropController.js
import Crop from "../models/Crop.js";
import Farmer from "../models/Farmer.js";

/* ───────────────────────────────────────────────
   GET ALL CROPS  —  Public, with search/filter/pagination
─────────────────────────────────────────────── */
export const getAllCrops = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      state = "",
      status = "Available",
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (state) filter.state = { $regex: state, $options: "i" };
    if (search) {
      filter.$or = [
        { cropName: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const [total, crops] = await Promise.all([
      Crop.countDocuments(filter),
      Crop.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
    ]);

    res.json({
      crops,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("GET ALL CROPS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ───────────────────────────────────────────────
   GET MY CROPS  —  Protected (farmer)
─────────────────────────────────────────────── */
export const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(crops);
  } catch (err) {
    console.error("GET MY CROPS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ───────────────────────────────────────────────
   CREATE CROP  —  Protected (farmer)
─────────────────────────────────────────────── */
export const createCrop = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select(
      "name phone state"
    );
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const {
      cropName,
      quantity,
      pricePerQuintal,
      state,
      location,
      category,
      description,
      cropImage,
    } = req.body;

    if (!cropName || !quantity || !pricePerQuintal || !state) {
      return res
        .status(400)
        .json({ message: "cropName, quantity, pricePerQuintal and state are required" });
    }

    const crop = await Crop.create({
      cropName,
      quantity: parseFloat(quantity),
      pricePerQuintal: parseFloat(pricePerQuintal),
      state: state || farmer.state,
      location: location || "",
      category: category || "Others",
      description: description || "",
      cropImage: cropImage || "",
      farmerId: farmer._id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
    });

    res.status(201).json(crop);
  } catch (err) {
    console.error("CREATE CROP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ───────────────────────────────────────────────
   UPDATE CROP  —  Protected (farmer, must own it)
─────────────────────────────────────────────── */
export const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // Ownership check
    if (crop.farmerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowed = [
      "cropName",
      "quantity",
      "pricePerQuintal",
      "state",
      "location",
      "category",
      "description",
      "cropImage",
      "status",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) crop[field] = req.body[field];
    });

    await crop.save();
    res.json(crop);
  } catch (err) {
    console.error("UPDATE CROP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ───────────────────────────────────────────────
   DELETE CROP  —  Protected (farmer, must own it)
─────────────────────────────────────────────── */
export const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // Ownership check
    if (crop.farmerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await crop.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE CROP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

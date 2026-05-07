// server/models/Crop.js
import mongoose from "mongoose";

const CropSchema = new mongoose.Schema(
  {
    /* ─────────────────────────────────────────
       CROP INFORMATION
    ───────────────────────────────────────── */
    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "quintal",
      enum: ["quintal", "kg", "ton"],
    },

    pricePerQuintal: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["Cereals", "Pulses", "Vegetables", "Fruits", "Spices", "Others"],
      default: "Others",
    },

    description: {
      type: String,
      default: "",
    },

    /* ─────────────────────────────────────────
       LOCATION
    ───────────────────────────────────────── */
    state: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    /* ─────────────────────────────────────────
       FARMER INFO (denormalized for fast reads)
    ───────────────────────────────────────── */
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },

    farmerName: {
      type: String,
      required: true,
    },

    farmerPhone: {
      type: String,
      required: true,
    },

    /* ─────────────────────────────────────────
       IMAGE
    ───────────────────────────────────────── */
    cropImage: {
      type: String,
      default: "", // URL or relative path
    },

    /* ─────────────────────────────────────────
       STATUS
    ───────────────────────────────────────── */
    status: {
      type: String,
      enum: ["Available", "Sold", "Under Review"],
      default: "Available",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Index for search performance
CropSchema.index({ cropName: "text", state: "text", farmerName: "text" });

export default mongoose.model("Crop", CropSchema);

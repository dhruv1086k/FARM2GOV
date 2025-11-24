import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
  name: { type: String },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: "kg" },
});

const FarmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    state: { type: String },
    language: { type: String, default: "en" },

    active: { type: Boolean, default: true },

    // ✔ REQUIRED FOR ACTIVE TODAY
    lastLogin: { type: Date, default: null },

    lastPredictedPrice: { type: Number, default: null },

    crops: [CropSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Farmer", FarmerSchema);

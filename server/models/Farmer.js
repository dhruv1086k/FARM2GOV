// server/models/Farmer.js
import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
  name: { type: String },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: "kg" },
});

const FarmerSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------
       BASIC INFORMATION
    --------------------------------------------------------- */
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: null },

    password: { type: String, required: true },

    state: { type: String },
    language: { type: String, default: "en" },

    /* ---------------------------------------------------------
       ACCOUNT STATUS
    --------------------------------------------------------- */
    active: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },

    /* ---------------------------------------------------------
       PRICE PREDICTION HISTORY
    --------------------------------------------------------- */
    lastPredictedPrice: { type: Number, default: null },

    /* ---------------------------------------------------------
       CROPS ADDED BY FARMER
    --------------------------------------------------------- */
    crops: [CropSchema],

    /* ---------------------------------------------------------
       PASSWORD RESET (OTP-BASED)
    --------------------------------------------------------- */

    // OTP sent to user
    resetOtp: { type: String, default: null },

    // OTP expiration time
    resetOtpExpires: { type: Date, default: null },

    // Track wrong attempts
    resetOtpAttempts: { type: Number, default: 0 },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export default mongoose.model("Farmer", FarmerSchema);

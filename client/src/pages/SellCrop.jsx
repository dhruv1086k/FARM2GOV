// client/src/pages/SellCrop.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  FaSeedling,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaUpload,
  FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../api/axios";

/* ─── Static Data ─────────────────────────── */
const CATEGORIES = ["Cereals", "Pulses", "Vegetables", "Fruits", "Spices", "Others"];
const UNITS = ["quintal", "kg", "ton"];
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
];

export default function SellCrop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    unit: "quintal",
    pricePerQuintal: "",
    state: "",
    location: "",
    category: "Cereals",
    description: "",
  });

  /* ─── Dropzone for image ──────────────── */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ─── Submit ──────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["cropName", "quantity", "pricePerQuintal", "state"];
    for (const f of required) {
      if (!form[f]) {
        toast.error(`${f.replace(/([A-Z])/g, " $1")} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      await API.post("/crops", {
        ...form,
        cropImage: imagePreview || "",
      });
      toast.success("🌾 Crop listed successfully!");
      setTimeout(() => navigate("/farmer/dashboard"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-14 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded-full">
            <FaSeedling /> Sell Your Crop
          </span>
          <h1 className="text-4xl font-extrabold text-green-900 mt-4">
            Create a Crop Listing
          </h1>
          <p className="text-gray-600 mt-2">
            Reach thousands of buyers across India. Fill in the details below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 space-y-6"
        >
          {/* Row 1 — Crop Name + Category */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Crop Name *" required>
              <input
                name="cropName"
                value={form.cropName}
                onChange={handleChange}
                placeholder="e.g., Wheat, Rice, Tomato"
                className={inputCls}
              />
            </Field>
            <Field label="Category">
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row 2 — Quantity + Unit */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Quantity *" required>
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g., 100"
                className={inputCls}
              />
            </Field>
            <Field label="Unit">
              <select name="unit" value={form.unit} onChange={handleChange} className={inputCls}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row 3 — Price */}
          <Field label="Price Per Quintal (₹) *" required>
            <div className="relative">
              <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
              <input
                name="pricePerQuintal"
                type="number"
                min="1"
                value={form.pricePerQuintal}
                onChange={handleChange}
                placeholder="e.g., 2500"
                className={`${inputCls} pl-10`}
              />
            </div>
          </Field>

          {/* Row 4 — State + Location */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="State *" required>
              <select name="state" value={form.state} onChange={handleChange} className={inputCls}>
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="City / District">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., Amritsar"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe quality, packaging, any special features..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Image Upload */}
          <Field label="Crop Image (optional)">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragActive
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
              }`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl mx-auto shadow"
                  />
                  <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                    <FaCheck /> Image selected — click to change
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <FaUpload className="text-3xl text-gray-400 mx-auto" />
                  <p className="text-gray-600 text-sm">
                    {isDragActive ? "Drop the image here..." : "Drag & drop or click to upload crop image"}
                  </p>
                  <p className="text-gray-400 text-xs">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 hover:shadow-lg hover:shadow-green-300/40"
            }`}
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Listing Crop...
              </>
            ) : (
              <>
                <FaSeedling />
                List Crop for Sale
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────── */
const inputCls =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-800 placeholder-gray-400";

function Field({ label, required = false, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

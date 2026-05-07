// client/src/pages/Marketplace.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaSeedling,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaShoppingCart,
  FaSyncAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../api/axios";
import SkeletonCard from "../components/SkeletonCard";

/* ─── Static Options ─────────────────────── */
const CATEGORIES = ["", "Cereals", "Pulses", "Vegetables", "Fruits", "Spices", "Others"];
const STATES = [
  "", "Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

/* ─── Image Fallback ─────────────────────── */
const CROP_IMAGES = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
  rice: "https://images.unsplash.com/photo-1536304993881-ff86e0c9e2ca?w=400",
  maize: "https://images.unsplash.com/photo-1602524816880-53bde73e3d35?w=400",
  tomato: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
  default: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
};

function getCropImage(name, uploaded) {
  if (uploaded) return uploaded;
  const lower = (name || "").toLowerCase();
  return (
    Object.entries(CROP_IMAGES).find(([k]) => lower.includes(k))?.[1] ||
    CROP_IMAGES.default
  );
}

const statusColor = {
  Available: "bg-green-100 text-green-700",
  Sold: "bg-red-100 text-red-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
};

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /* ─── Fetch crops ─────────────────────── */
  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await API.get("/crops", {
        params: { search, category, state, page, limit: 9 },
      });
      setCrops(res.data.crops);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to load crop listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchCrops();
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setState("");
    setPage(1);
    setTimeout(fetchCrops, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pb-16">

      {/* ─── HERO BANNER ─────────────────── */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaShoppingCart className="text-5xl mx-auto mb-4 text-green-300" />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Crop Marketplace
            </h1>
            <p className="text-green-200 text-lg max-w-xl mx-auto">
              Buy directly from farmers across India. Fresh produce, fair prices, no middlemen.
            </p>
            <p className="mt-3 text-green-300 text-sm font-semibold">
              {total} listings available right now
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── SEARCH & FILTER BAR ─────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-green-100 p-5 flex flex-col md:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search crops, farmers, locations..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-700 min-w-[150px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-700 min-w-[150px]"
          >
            <option value="">All States</option>
            {STATES.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition shadow"
            >
              <FaFilter className="text-sm" />
              Filter
            </button>
            <button
              onClick={handleReset}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition"
              title="Reset filters"
            >
              <FaSyncAlt />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── CROP GRID ───────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : crops.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-8xl mb-5">🌾</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Crops Found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search filters or check back later.
            </p>
            <button
              onClick={handleReset}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${search}-${category}-${state}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {crops.map((crop, i) => (
                <CropCard key={crop._id} crop={crop} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ─── PAGINATION ──────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition text-sm font-medium"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                  page === i + 1
                    ? "bg-green-700 text-white shadow"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition text-sm font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Crop Card Component ─────────────────── */
function CropCard({ crop, index }) {
  const [contacted, setContacted] = useState(false);

  const handleContact = () => {
    toast.success(`📞 Contacting ${crop.farmerName} at ${crop.farmerPhone}`);
    setContacted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-green-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={getCropImage(crop.cropName, crop.cropImage)}
          alt={crop.cropName}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.src = CROP_IMAGES.default; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 bg-green-700/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {crop.category}
        </span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${statusColor[crop.status] || "bg-gray-100 text-gray-700"}`}>
          {crop.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{crop.cropName}</h3>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
              <FaSeedling className="text-green-500 text-xs" />
              By {crop.farmerName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-green-700">
              ₹{crop.pricePerQuintal.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-400">/quintal</p>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600 mb-4">
          <p className="flex items-center gap-2">
            <span className="text-gray-400">📦</span>
            {crop.quantity} {crop.unit}
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-400 text-xs" />
            {crop.location ? `${crop.location}, ` : ""}{crop.state}
          </p>
          {crop.description && (
            <p className="text-gray-500 text-xs line-clamp-2">{crop.description}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleContact}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${
              contacted
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-green-700 hover:bg-green-800 text-white shadow"
            }`}
          >
            <FaPhoneAlt className="text-xs" />
            {contacted ? "Contacted!" : "Contact Farmer"}
          </button>
          <button className="px-4 py-2.5 border border-green-200 rounded-xl text-green-700 hover:bg-green-50 text-sm font-semibold transition flex items-center gap-1">
            <FaShoppingCart className="text-xs" />
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
}

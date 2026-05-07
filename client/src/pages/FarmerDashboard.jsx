// client/src/pages/FarmerDashboard.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaSeedling,
  FaRupeeSign,
  FaFileAlt,
  FaRobot,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCloudSun,
  FaBug,
  FaMicrophone,
  FaStore,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { SkeletonStatCard } from "../components/SkeletonCard";

/* ─── Animation Helpers ───────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

/* ─── Dummy weekly earnings data ──────────── */
const earningsData = [
  { day: "Mon", earnings: 4200 },
  { day: "Tue", earnings: 6800 },
  { day: "Wed", earnings: 3100 },
  { day: "Thu", earnings: 9400 },
  { day: "Fri", earnings: 7200 },
  { day: "Sat", earnings: 11000 },
  { day: "Sun", earnings: 5600 },
];

/* ─── Dummy AI recommendations ───────────── */
const aiRecs = [
  { crop: "Wheat", action: "Good time to sell — prices rising in Punjab", icon: "🌾", risk: "Low" },
  { crop: "Rice", action: "Hold stock for 2 weeks — monsoon expected", icon: "🍚", risk: "Medium" },
  { crop: "Tomato", action: "Sell immediately — surplus incoming", icon: "🍅", risk: "High" },
];

/* ─── Dummy recent activities ─────────────── */
const activities = [
  { msg: "Crop listing 'Wheat 500 quintal' approved", time: "2 hours ago", type: "success" },
  { msg: "AI prediction run for Maize in Punjab", time: "5 hours ago", type: "info" },
  { msg: "Government scheme PM-KISAN payment received", time: "1 day ago", type: "success" },
  { msg: "Profile updated successfully", time: "3 days ago", type: "info" },
];

/* ─── Pie chart colors ─────────────────────── */
const PIE_COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

export default function FarmerDashboard() {
  const [profile, setProfile] = useState(null);
  const [myCrops, setMyCrops] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useContext(AuthContext);

  /* ─── Fetch profile ───────────────────── */
  useEffect(() => {
    API.get("/farmers/me")
      .then((res) => setProfile(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          toast.error("Your account is deactivated. Logging out...");
          localStorage.removeItem("token");
          setTimeout(() => (window.location.href = "/farmer/login"), 1500);
        } else {
          toast.error("Failed to load profile");
        }
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  /* ─── Fetch my crop listings ──────────── */
  useEffect(() => {
    API.get("/crops/my")
      .then((res) => setMyCrops(res.data))
      .catch(() => toast.error("Failed to load crop listings"))
      .finally(() => setLoadingCrops(false));
  }, []);

  /* ─── Delete a crop ───────────────────── */
  const deleteCrop = async (id) => {
    if (!window.confirm("Delete this crop listing?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/crops/${id}`);
      setMyCrops((prev) => prev.filter((c) => c._id !== id));
      toast.success("Crop listing deleted");
    } catch {
      toast.error("Failed to delete crop");
    } finally {
      setDeletingId(null);
    }
  };

  /* ─── Pie chart data from myCrops ────── */
  const categoryData = myCrops.reduce((acc, c) => {
    const existing = acc.find((a) => a.name === c.category);
    if (existing) existing.value++;
    else acc.push({ name: c.category || "Others", value: 1 });
    return acc;
  }, []);

  /* ─── Stats ───────────────────────────── */
  const totalEarnings = myCrops.reduce(
    (sum, c) => sum + c.quantity * c.pricePerQuintal,
    0
  );

  const statCards = [
    {
      label: "Total Crops Listed",
      value: myCrops.length,
      icon: FaSeedling,
      color: "from-green-500 to-green-600",
      light: "bg-green-50 text-green-600",
    },
    {
      label: "Expected Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN")}`,
      icon: FaRupeeSign,
      color: "from-emerald-500 to-emerald-600",
      light: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "AI Predictions Done",
      value: "12",
      icon: FaRobot,
      color: "from-teal-500 to-teal-600",
      light: "bg-teal-50 text-teal-600",
    },
    {
      label: "Policies Available",
      value: "25+",
      icon: FaFileAlt,
      color: "from-lime-500 to-lime-600",
      light: "bg-lime-50 text-lime-600",
    },
  ];

  /* ─── Loading skeleton ────────────────── */
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3 mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonStatCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pb-16">

      {/* ─── HEADER ─────────────────────── */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-green-300 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {profile?.name} 👨‍🌾
            </h1>
            <p className="text-green-200 mt-1 text-sm">
              📍 {profile?.state} &nbsp;|&nbsp; 📞 {profile?.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/sell-crop"
              className="flex items-center gap-2 bg-white text-green-800 font-bold px-5 py-2.5 rounded-xl shadow hover:bg-green-50 transition"
            >
              <FaPlus /> Sell Crop
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/25 transition"
            >
              <FaStore /> Marketplace
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 space-y-8">

        {/* ─── STAT CARDS ─────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-green-100 overflow-hidden transition"
            >
              <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                    {s.label}
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    {s.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.light}`}>
                  <s.icon className="text-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── CHARTS ROW ─────────────────── */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Earnings Chart */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <FaChartLine className="text-green-600" />
                Weekly Earnings (₹)
              </h3>
              <span className="text-xs text-gray-500 bg-green-50 px-3 py-1 rounded-full">
                This Week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={earningsData} barSize={30}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Earnings"]}
                  contentStyle={{ borderRadius: 12, fontSize: 13 }}
                />
                <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crop Category Pie */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
          >
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-5">
              <FaSeedling className="text-green-600" />
              Crop Categories
            </h3>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No crops listed yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={10} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* ─── MY CROP LISTINGS ───────────── */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
          className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-green-50">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <FaSeedling className="text-green-600" />
              My Crop Listings
            </h3>
            <Link
              to="/sell-crop"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              <FaPlus className="text-xs" /> Add Listing
            </Link>
          </div>

          {loadingCrops ? (
            <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : myCrops.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="text-7xl mb-4">🌱</div>
              <h4 className="text-xl font-bold text-gray-700 mb-2">
                No Crops Listed Yet
              </h4>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Start selling your produce directly to buyers. Add your first crop listing now!
              </p>
              <Link
                to="/sell-crop"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl transition"
              >
                <FaPlus /> Add Your First Crop
              </Link>
            </div>
          ) : (
            <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCrops.map((crop) => (
                <div
                  key={crop._id}
                  className="border border-green-100 rounded-xl p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{crop.cropName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{crop.category}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        crop.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : crop.status === "Sold"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {crop.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📦 {crop.quantity} {crop.unit}</p>
                    <p>💰 ₹{crop.pricePerQuintal.toLocaleString("en-IN")}/quintal</p>
                    <p>📍 {crop.state}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => deleteCrop(crop._id)}
                      disabled={deletingId === crop._id}
                      className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                    >
                      {deletingId === crop._id ? (
                        <span className="h-3 w-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaTrash className="text-xs" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── AI RECOMMENDATIONS + ACTIVITY ─ */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* AI Recommendations */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-6 text-white"
          >
            <h3 className="font-bold text-lg flex items-center gap-2 mb-5">
              <FaRobot className="text-green-300" />
              AI Recommendations
            </h3>
            <div className="space-y-4">
              {aiRecs.map((r, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-white flex items-center gap-2">
                      {r.icon} {r.crop}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        r.risk === "Low"
                          ? "bg-green-400/20 text-green-300"
                          : r.risk === "Medium"
                          ? "bg-yellow-400/20 text-yellow-300"
                          : "bg-red-400/20 text-red-300"
                      }`}
                    >
                      {r.risk} Risk
                    </span>
                  </div>
                  <p className="text-green-200 text-sm">{r.action}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={5}
            className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
          >
            <h3 className="font-bold text-gray-800 text-lg mb-5">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      a.type === "success" ? "bg-green-500" : "bg-blue-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-gray-700">{a.msg}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── QUICK ACTION TILES ─────────── */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={6}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {[
            { to: "/predict", icon: FaRobot, label: "Price Predictor", color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200" },
            { to: "/disease-detect", icon: FaBug, label: "Disease Detect", color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200" },
            { to: "/voice-assistant", icon: FaMicrophone, label: "Voice Assistant", color: "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200" },
            { to: "/policies", icon: FaFileAlt, label: "View Policies", color: "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200" },
          ].map((tile, i) => (
            <Link
              key={i}
              to={tile.to}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all text-center ${tile.color}`}
            >
              <tile.icon className="text-2xl" />
              <span className="text-sm font-semibold">{tile.label}</span>
            </Link>
          ))}
        </motion.div>

        {/* ─── PROFILE CARD ───────────────── */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={7}
          className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
        >
          <h3 className="font-bold text-gray-800 text-lg mb-5">Your Profile</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "Full Name", value: profile?.name },
              { label: "Phone", value: profile?.phone },
              { label: "Email", value: profile?.email || "—" },
              { label: "State", value: profile?.state || "—" },
              { label: "Language", value: profile?.language || "en" },
              { label: "Member Since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "—" },
            ].map((row, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{row.label}</p>
                <p className="text-gray-900 font-semibold mt-1">{row.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// client/src/pages/Policies.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt, FaSearch, FaFilter, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import API from "../api/axios";
import SkeletonCard from "../components/SkeletonCard";

const CATEGORIES = ["All", "Subsidy", "Insurance", "Credit", "Market", "Training", "Infrastructure", "Other"];

const categoryColors = {
  Subsidy: "bg-green-100 text-green-700",
  Insurance: "bg-blue-100 text-blue-700",
  Credit: "bg-purple-100 text-purple-700",
  Market: "bg-orange-100 text-orange-700",
  Training: "bg-teal-100 text-teal-700",
  Infrastructure: "bg-indigo-100 text-indigo-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get("/policies")
      .then((res) => setPolicies(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ─── Filter ────────────────────────── */
  const filtered = policies.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

      {/* ─── HEADER BANNER ─────────────── */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center"
        >
          <FaFileAlt className="text-5xl mx-auto mb-4 text-green-300" />
          <h1 className="text-5xl font-extrabold mb-3">
            Government Policies
          </h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            Latest government schemes, subsidies, and agricultural updates to help farmers maximize their benefits.
          </p>
          <p className="mt-3 text-green-300 font-semibold text-sm">
            {policies.length} active policies available
          </p>
        </motion.div>
      </div>

      {/* ─── SEARCH + FILTER ───────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-green-100 p-5"
        >
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search policies by title or keyword..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  activeCategory === cat
                    ? "bg-green-700 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── POLICIES GRID ─────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-7xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Policies Found</h3>
            <p className="text-gray-500">
              {search ? "Try different keywords or " : ""}
              {activeCategory !== "All" ? "change the category filter." : "No policies are available yet."}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-5 bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold transition"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {filtered.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-green-100 overflow-hidden transition"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {p.category && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[p.category] || "bg-gray-100 text-gray-700"}`}>
                            {p.category}
                          </span>
                        )}
                        {p.createdAt && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FaCalendarAlt />
                            {new Date(p.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "long", year: "numeric"
                            })}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{p.title}</h2>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {p.content}
                      </p>
                    </div>
                    <span className="text-gray-400 text-xl shrink-0 transition-transform duration-200"
                      style={{ transform: expanded === p._id ? "rotate(180deg)" : "rotate(0)" }}>
                      ↓
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expanded === p._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-green-50 px-6 py-5 bg-green-50/50">
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {p.content}
                        </p>
                        <div className="mt-4 flex gap-3">
                          <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                            Apply Now
                          </button>
                          <button className="flex items-center gap-2 border border-green-200 text-green-700 hover:bg-green-50 text-sm font-semibold px-4 py-2 rounded-xl transition">
                            <FaExternalLinkAlt className="text-xs" />
                            Learn More
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

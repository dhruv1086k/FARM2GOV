// client/src/pages/AdminDashboard.jsx
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  FaUsers, FaFileAlt, FaSeedling, FaBolt, FaSearch,
  FaDownload, FaChartBar, FaClipboardList, FaPlus,
  FaCheckCircle, FaTimesCircle, FaTachometerAlt,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import toast from "react-hot-toast";
import API from "../api/axios";
import { SkeletonStatCard, SkeletonTableRow } from "../components/SkeletonCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07 },
  }),
};

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [exporting, setExporting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  /* ─── Queries ──────────────────────── */
  const { data: stats, isLoading: statsLoading } = useQuery(["adminStats"], async () => {
    const res = await API.get("/admin/stats");
    return res.data;
  });

  const { data: farmersData, isLoading: farmersLoading } = useQuery(
    ["farmers", page, search],
    async () => {
      const res = await API.get("/admin/farmers", { params: { page, limit, search } });
      return res.data;
    }
  );

  /* ─── Chart Data ───────────────────── */
  const signupChartData = useMemo(() =>
    (stats?.signups || []).map((i) => ({
      date: i._id.slice(5),
      signups: i.count,
    })), [stats]
  );

  /* ─── Dummy monthly crop revenue data */
  const revenueData = [
    { month: "Nov", revenue: 42000 },
    { month: "Dec", revenue: 58000 },
    { month: "Jan", revenue: 35000 },
    { month: "Feb", revenue: 67000 },
    { month: "Mar", revenue: 90000 },
    { month: "Apr", revenue: 78000 },
  ];

  /* ─── Export CSV ───────────────────── */
  const exportCSV = async () => {
    if (!farmersData?.farmers) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 800));
    const csv = Papa.unparse(
      farmersData.farmers.map((f) => ({
        Name: f.name,
        Phone: f.phone,
        Email: f.email,
        State: f.state,
        Status: f.active ? "Active" : "Inactive",
        "Joined On": new Date(f.createdAt).toLocaleDateString("en-IN"),
      }))
    );
    saveAs(new Blob([csv]), `farmers_export_${Date.now()}.csv`);
    setExporting(false);
    toast.success("CSV exported successfully!");
  };

  /* ─── Toggle Active ────────────────── */
  const toggleActive = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      await API.post(`/admin/farmers/${id}/toggle-active`);
      qc.invalidateQueries(["farmers"]);
      qc.invalidateQueries(["adminStats"]);
      toast.success(currentStatus ? "Farmer deactivated" : "Farmer activated");
    } catch {
      toast.error("Failed to update farmer status");
    } finally {
      setTogglingId(null);
    }
  };

  const statCards = [
    { label: "Total Farmers", value: stats?.totalFarmers ?? "—", icon: FaUsers, color: "from-green-500 to-green-600" },
    { label: "Active Today", value: stats?.activeToday ?? "—", icon: FaBolt, color: "from-emerald-500 to-emerald-600" },
    { label: "Total Policies", value: stats?.totalPolicies ?? "—", icon: FaFileAlt, color: "from-teal-500 to-teal-600" },
    { label: "Crop Listings", value: stats?.totalCrops ?? "—", icon: FaSeedling, color: "from-lime-500 to-lime-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ─── TOPBAR ──────────────────── */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-green-300 text-sm">Welcome back, Administrator</p>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 mt-1">
              <FaTachometerAlt className="text-green-300" />
              Admin Control Panel
            </h1>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/policies/create"
              className="flex items-center gap-2 bg-white text-green-800 font-bold px-5 py-2.5 rounded-xl shadow hover:bg-green-50 transition text-sm"
            >
              <FaPlus /> Create Policy
            </Link>
            <Link
              to="/admin/policies"
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/25 transition text-sm"
            >
              <FaClipboardList /> Manage Policies
            </Link>
            <button
              onClick={exportCSV}
              disabled={exporting}
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/25 transition text-sm disabled:opacity-60"
            >
              {exporting ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaDownload />
              )}
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">

        {/* ─── STAT CARDS ──────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsLoading
            ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
            : statCards.map((s, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                        {s.label}
                      </p>
                      <p className="text-3xl font-extrabold text-gray-900 mt-1">
                        {s.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color} bg-opacity-10`}>
                      <s.icon className="text-xl text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* ─── CHARTS ──────────────────── */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Farmer Signups Area Chart */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-5">
              <FaChartBar className="text-green-600" />
              Farmer Signups (Last 30 Days)
            </h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={signupChartData}>
                  <defs>
                    <linearGradient id="colorSign" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#16a34a"
                    fill="url(#colorSign)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Revenue Bar Chart */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-5">
              <FaSeedling className="text-green-600" />
              Monthly Crop Revenue (₹)
            </h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={revenueData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ─── FARMERS TABLE ───────────── */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <FaUsers className="text-green-600" />
                Registered Farmers
                {farmersData && (
                  <span className="text-sm font-normal text-gray-400">
                    ({farmersData.total} total)
                  </span>
                )}
              </h3>

              {/* Search */}
              <div className="flex gap-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(searchInput);
                        setPage(1);
                      }
                    }}
                    placeholder="Search farmers..."
                    className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none w-52"
                  />
                </div>
                <button
                  onClick={() => { setSearch(searchInput); setPage(1); }}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50 border-b border-green-100">
                <tr className="text-left text-gray-600">
                  <th className="py-3.5 px-5 font-semibold">Farmer Name</th>
                  <th className="px-4 font-semibold">Phone</th>
                  <th className="px-4 font-semibold">Email</th>
                  <th className="px-4 font-semibold">State</th>
                  <th className="px-4 font-semibold">Joined</th>
                  <th className="px-4 font-semibold">Status</th>
                  <th className="px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {farmersLoading
                  ? [...Array(5)].map((_, i) => <SkeletonTableRow key={i} cols={7} />)
                  : (farmersData?.farmers || []).map((f) => (
                      <tr
                        key={f._id}
                        className="border-b border-gray-50 hover:bg-green-50/40 transition"
                      >
                        <td className="py-4 px-5 font-semibold text-gray-900">{f.name}</td>
                        <td className="px-4 text-gray-600">{f.phone}</td>
                        <td className="px-4 text-gray-600 text-xs">{f.email || "—"}</td>
                        <td className="px-4 text-gray-600">{f.state || "—"}</td>
                        <td className="px-4 text-gray-500 text-xs">
                          {new Date(f.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4">
                          {f.active ? (
                            <span className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                              <FaCheckCircle /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 font-semibold text-xs">
                              <FaTimesCircle /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4">
                          <button
                            onClick={() => toggleActive(f._id, f.active)}
                            disabled={togglingId === f._id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition ${
                              f.active
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-600 hover:bg-green-700"
                            } ${togglingId === f._id ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            {togglingId === f._id && (
                              <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {f.active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {(farmersData?.farmers || []).map((f) => (
              <div key={f._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.phone} • {f.state || "—"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{f.email || "No email"}</p>
                  </div>
                  {f.active ? (
                    <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">Active</span>
                  ) : (
                    <span className="text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full">Inactive</span>
                  )}
                </div>
                <button
                  onClick={() => toggleActive(f._id, f.active)}
                  disabled={togglingId === f._id}
                  className={`mt-3 w-full py-2 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition ${
                    f.active ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {f.active ? "Deactivate Farmer" : "Activate Farmer"}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {farmersData && farmersData.total > limit && (
            <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm">
              <p className="text-gray-500">
                Page {page} of {Math.ceil(farmersData.total / limit)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 font-medium transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(farmersData.total / limit)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 font-medium transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import API from "../api/axios";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function AdminDashboard() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // ===== STATS =====
  const { data: stats, isLoading: statsLoading } = useQuery(
    ["adminStats"],
    async () => {
      const res = await API.get("/admin/stats");
      return res.data;
    }
  );

  // ===== FARMERS =====
  const { data: farmersData, isLoading: farmersLoading } = useQuery(
    ["farmers", page, search],
    async () => {
      const res = await API.get("/admin/farmers", {
        params: { page, limit, search },
      });
      return res.data;
    }
  );

  // ===== CHART DATA =====
  const chartData = useMemo(() => {
    return (
      stats?.signups?.map((i) => ({
        date: i._id.slice(5),
        signups: i.count,
      })) || []
    );
  }, [stats]);

  // ===== EXPORT CSV =====
  const exportCSV = async () => {
    if (!farmersData?.farmers) return;

    setExporting(true);

    setTimeout(() => {
      const csv = Papa.unparse(
        farmersData.farmers.map((f) => ({
          name: f.name,
          phone: f.phone,
          email: f.email,
          state: f.state,
          active: f.active ? "Active" : "Inactive",
          createdAt: f.createdAt,
          lastLogin: f.lastLogin || "Never",
        }))
      );

      saveAs(new Blob([csv]), "farmers.csv");
      setExporting(false);
    }, 800);
  };

  // ===== TOGGLE ACTIVE =====
  const toggleActive = async (id) => {
    setTogglingId(id);
    await API.post(`/admin/farmers/${id}/toggle-active`);
    qc.invalidateQueries(["farmers"]);
    qc.invalidateQueries(["adminStats"]);
    setTogglingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-green-800 tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          to="/admin/dashboard"
          className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl shadow transition"
        >
          Dashboard Home
        </Link>

        <Link
          to="/admin/policies"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow transition"
        >
          Manage Policies
        </Link>

        <Link
          to="/admin/policies/create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
        >
          Create Policy
        </Link>

        <button
          onClick={exportCSV}
          disabled={exporting}
          className={`px-4 py-2 rounded-xl text-white shadow flex items-center gap-2 transition
            ${
              exporting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-800"
            }`}
        >
          {exporting ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Exporting...
            </>
          ) : (
            "Export Farmers CSV"
          )}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsLoading ? (
          <>
            <CardLoader />
            <CardLoader />
            <CardLoader />
          </>
        ) : (
          <>
            <Card title="Total Farmers" value={stats?.totalFarmers} />
            <Card title="Active Today" value={stats?.activeToday} />
            <Card title="Policies" value={stats?.totalPolicies} />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white/90 backdrop-blur-lg border border-green-100 p-6 rounded-2xl shadow mb-10">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Signups (Last 30 Days)
        </h3>

        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSign" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="#16a34a"
                fill="url(#colorSign)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white/90 backdrop-blur-lg border border-green-100 p-6 rounded-2xl shadow">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farmers..."
              className="border px-4 py-2 rounded-xl shadow-sm w-full sm:w-auto"
            />

            <button
              onClick={() => setPage(1)}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl shadow transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table Loader */}
        {farmersLoading && <TableLoader />}

        {/* DESKTOP TABLE (md and above) */}
        {!farmersLoading && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600 border-b bg-green-50">
                  <th className="py-2 px-1">Name</th>
                  <th className="px-1">Phone</th>
                  <th className="px-1">Email</th>
                  <th className="px-1">State</th>
                  <th className="px-1">Active</th>
                  <th className="px-1">Actions</th>
                </tr>
              </thead>

              <tbody>
                {(farmersData?.farmers || []).map((f) => (
                  <tr
                    key={f._id}
                    className="border-b hover:bg-green-50 transition"
                  >
                    <td className="py-3">{f.name}</td>
                    <td>{f.phone}</td>
                    <td>{f.email}</td>
                    <td>{f.state}</td>

                    <td>
                      {f.active ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() => toggleActive(f._id)}
                        disabled={togglingId === f._id}
                        className={`px-3 py-1 rounded-lg text-white flex items-center gap-2 transition ${
                          f.active
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        } ${
                          togglingId === f._id
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {togglingId === f._id && (
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                        {f.active ? "Deactivate Farmer" : "Activate Farmer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE VERSION (cards) */}
        {!farmersLoading && (
          <div className="md:hidden grid gap-4">
            {farmersData?.farmers?.map((f) => (
              <div
                key={f._id}
                className="border border-green-100 bg-white rounded-xl shadow-sm p-4"
              >
                <p className="font-bold text-lg text-green-800">{f.name}</p>

                <div className="mt-2 text-gray-600 text-sm space-y-1">
                  <p>
                    <span className="font-medium">📞 Phone:</span> {f.phone}
                  </p>
                  <p>
                    <span className="font-medium">📧 Email:</span> {f.email}
                  </p>
                  <p>
                    <span className="font-medium">📍 State:</span> {f.state}
                  </p>

                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {f.active ? (
                      <span className="text-green-700 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => toggleActive(f._id)}
                  disabled={togglingId === f._id}
                  className={`mt-4 w-full py-2 rounded-lg text-white flex items-center justify-center gap-2 transition ${
                    f.active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } ${
                    togglingId === f._id ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {togglingId === f._id && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {f.active ? "Deactivate Farmer" : "Activate Farmer"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------- BEAUTIFUL STAT CARD ----------- */
function Card({ title, value }) {
  const emojiMap = {
    "Total Farmers": "👨‍🌾",
    "Active Today": "⚡",
    Policies: "📝",
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-green-100 p-6 rounded-2xl shadow flex items-center justify-between">
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-3xl font-bold text-green-800">{value}</p>
      </div>

      <div className="text-4xl opacity-20">{emojiMap[title] || "📊"}</div>
    </div>
  );
}

/* ----------- STAT CARD LOADER ----------- */
function CardLoader() {
  return (
    <div className="bg-white/70 backdrop-blur-lg border border-green-100 p-6 rounded-2xl shadow animate-pulse">
      <div className="h-4 bg-gray-200 w-24 rounded mb-3"></div>
      <div className="h-8 bg-gray-300 w-32 rounded"></div>
    </div>
  );
}

/* ----------- TABLE SHIMMER LOADER ----------- */
function TableLoader() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-full h-10 bg-gray-200 animate-pulse rounded-md"
        ></div>
      ))}
    </div>
  );
}

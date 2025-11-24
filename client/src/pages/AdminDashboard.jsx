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

  // ===== STATS =====
  const { data: stats } = useQuery(["adminStats"], async () => {
    const res = await API.get("/admin/stats");
    return res.data;
  });

  // ===== FARMERS =====
  const { data: farmersData } = useQuery(
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
  const exportCSV = () => {
    if (!farmersData?.farmers) return;

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
  };

  // ===== TOGGLE ACTIVE =====
  const toggleActive = async (id) => {
    await API.post(`/admin/farmers/${id}/toggle-active`);
    qc.invalidateQueries(["farmers"]);
    qc.invalidateQueries(["adminStats"]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/admin/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          Dashboard Home
        </Link>

        <Link
          to="/admin/policies"
          className="px-4 py-2 bg-green-600 text-white rounded shadow"
        >
          Manage Policies
        </Link>

        <Link
          to="/admin/policies/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
        >
          Create Policy
        </Link>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-gray-700 text-white rounded shadow"
        >
          Export Farmers CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Farmers" value={stats?.totalFarmers ?? "..."} />
        <Card title="Active Today" value={stats?.activeToday ?? "..."} />
        <Card title="Policies" value={stats?.totalPolicies ?? "..."} />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-2">Signups (Last 30 Days)</h3>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSign" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="#16a34a"
                fill="url(#colorSign)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farmers..."
              className="border px-3 py-2 rounded-md"
            />

            <button
              onClick={() => setPage(1)}
              className="bg-green-600 text-white px-3 py-2 rounded-md"
            >
              Search
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>State</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(farmersData?.farmers || []).map((f) => (
              <tr key={f._id} className="border-b">
                <td className="py-3">{f.name}</td>
                <td>{f.phone}</td>
                <td>{f.email}</td>
                <td>{f.state}</td>

                <td>
                  {f.active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>

                <td>
                  <button
                    onClick={() => toggleActive(f._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl opacity-20">📊</div>
    </div>
  );
}

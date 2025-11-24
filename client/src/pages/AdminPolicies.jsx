import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);

  const loadPolicies = async () => {
    const res = await API.get("/policies");
    setPolicies(res.data);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const deletePolicy = async (id) => {
    if (!confirm("Delete this policy?")) return;

    await API.delete(`/policies/${id}`);
    loadPolicies();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Manage Policies</h1>

      <Link
        to="/admin/policies/create"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Create New Policy
      </Link>

      <div className="mt-6 bg-white shadow rounded p-4">
        {policies.map((p) => (
          <div
            key={p._id}
            className="border-b py-3 flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold">{p.title}</h2>

              {/* FIXED: Use content instead of description */}
              <p className="text-sm text-gray-500">
                {p.content?.substring(0, 80)}...
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/policies/edit/${p._id}`}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deletePolicy(p._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const res = await API.get("/policies");
      setPolicies(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const deletePolicy = async (id) => {
    if (!confirm("Delete this policy?")) return;

    setDeletingId(id);
    await API.delete(`/policies/${id}`);
    setDeletingId(null);
    loadPolicies();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 tracking-tight text-center md:text-left">
            Manage Policies
          </h1>

          <Link
            to="/admin/policies/create"
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl shadow-lg transition text-center"
          >
            + Create New Policy
          </Link>
        </div>

        {/* Policies Container */}
        <div className="bg-white/90 backdrop-blur-lg border border-green-100 rounded-3xl shadow-xl p-4 sm:p-6">
          {/* Loader */}
          {loading && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 animate-pulse rounded-xl"
                ></div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && policies.length === 0 && (
            <p className="text-center text-gray-600 py-10 font-medium">
              No policies found.
            </p>
          )}

          {/* Policies List */}
          {!loading &&
            policies.map((p) => (
              <div
                key={p._id}
                className="border border-gray-200 bg-white rounded-2xl p-5 mb-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left: Text */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-green-800 break-words">
                      {p.title}
                    </h2>

                    <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                      {p.content?.substring(0, 120)}...
                    </p>

                    {p.category && (
                      <span className="inline-block mt-3 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {/* Right: Buttons */}
                  <div className="flex sm:flex-col gap-3 min-w-[100px] sm:min-w-[130px] w-full sm:w-auto">
                    <Link
                      to={`/admin/policies/edit/${p._id}`}
                      className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition text-center"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deletePolicy(p._id)}
                      disabled={deletingId === p._id}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl shadow text-white flex items-center justify-center gap-2 transition ${
                        deletingId === p._id
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {deletingId === p._id && (
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

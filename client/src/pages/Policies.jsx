import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/policies")
      .then((res) => setPolicies(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-green-100 px-6 py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-green-800 tracking-tight">
          Government Policies
        </h1>
        <p className="text-gray-700 mt-3 text-lg max-w-2xl mx-auto">
          Latest government policies, schemes, and updates for farmers.
        </p>
      </div>

      {/* Policies Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {policies.map((p) => (
          <div
            key={p._id}
            className="bg-white/90 backdrop-blur-md border border-green-100 shadow-xl rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            {/* Title */}
            <h2 className="text-2xl font-bold text-green-900 leading-snug">
              {p.title}
            </h2>

            {/* Category */}
            {p.category && (
              <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {p.category}
              </span>
            )}

            {/* Content */}
            <p className="text-gray-700 mt-5 text-sm leading-relaxed">
              {p.content}
            </p>

            {/* Date */}
            {p.createdAt && (
              <p className="text-gray-500 text-xs mt-6">
                Published on:{" "}
                <span className="font-medium">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        ))}

        {/* Empty State */}
        {policies.length === 0 && (
          <div className="col-span-full bg-white/80 rounded-2xl shadow-lg p-10 text-center border border-red-200">
            <h1 className="text-2xl text-red-500 font-bold">Login Required!</h1>
            <p className="text-gray-600 mt-3">
              No policies available right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

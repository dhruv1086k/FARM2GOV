import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

export default function EditPolicy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(true); // fetching policy
  const [updating, setUpdating] = useState(false); // updating policy

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await API.get(`/policies`);
        const found = res.data.find((p) => p._id === id);
        if (found) setForm(found);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await API.put(`/policies/${id}`, form);
      navigate("/admin/policies");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-green-50 to-green-100 p-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg border border-green-100 shadow-2xl rounded-3xl p-10">
        {/* Page Heading */}
        <h1 className="text-4xl font-extrabold text-green-800 mb-8 text-center tracking-tight">
          Edit Policy
        </h1>

        {/* Loader while fetching policy */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-40 bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-12 bg-gray-300 animate-pulse rounded-xl w-40"></div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">Policy Title</label>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-green-600 focus:border-green-600 transition shadow-sm outline-none"
                value={form.title}
                placeholder="Enter policy title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="text-gray-700 font-medium">
                Policy Content
              </label>
              <textarea
                className="w-full p-4 h-40 border border-gray-300 rounded-xl resize-none
                focus:ring-2 focus:ring-green-600 focus:border-green-600 transition shadow-sm outline-none"
                value={form.content}
                placeholder="Enter policy content"
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {/* Update Button */}
            <button
              disabled={updating}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-md flex items-center justify-center gap-3 transition ${
                updating
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {updating ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating...
                </>
              ) : (
                "Update Policy"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

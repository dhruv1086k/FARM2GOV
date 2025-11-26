import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePolicy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/policies", form);
      navigate("/admin/policies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-green-50 to-green-100 p-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg border border-green-100 shadow-2xl rounded-3xl p-10">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-green-800 mb-8 text-center tracking-tight">
          Create New Policy
        </h1>

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Policy Title</label>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-green-600 focus:border-green-600 transition shadow-sm outline-none"
              placeholder="Enter policy title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Policy Content</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-xl h-40 
              focus:ring-2 focus:ring-green-600 focus:border-green-600 transition shadow-sm outline-none resize-none"
              placeholder="Write detailed policy content here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          {/* Create Button with Loader */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md flex items-center justify-center gap-3 transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              "Create Policy"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

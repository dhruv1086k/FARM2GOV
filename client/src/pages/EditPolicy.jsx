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

  useEffect(() => {
    API.get("/policies").then((res) => {
      const found = res.data.find((p) => p._id === id);
      if (found) setForm(found);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await API.put(`/policies/${id}`, form);
    navigate("/admin/policies");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Policy</h1>

      <form onSubmit={submit} className="space-y-4 max-w-xl">
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}

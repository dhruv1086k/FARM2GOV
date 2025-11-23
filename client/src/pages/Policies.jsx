import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Policies() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/policies")
            .then(res => setPolicies(res.data))
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
        <div className="min-h-screen w-full bg-[#F4F6EE] px-6 py-10">

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-green-800">
                Government Policies
            </h1>
            <p className="text-gray-600 mt-2">
                Latest government policies, schemes, and updates for farmers.
            </p>

            {/* Policies Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

                {policies.map((p) => (
                    <div
                        key={p._id}
                        className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition"
                    >
                        <h2 className="text-2xl font-bold text-green-900">
                            {p.title}
                        </h2>

                        {/* Optional category if backend has it */}
                        {p.category && (
                            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                {p.category}
                            </span>
                        )}

                        <p className="text-gray-700 mt-4 text-sm leading-relaxed">
                            {p.content}
                        </p>

                        {/* Date if included in backend */}
                        {p.createdAt && (
                            <p className="text-gray-500 text-xs mt-4">
                                Published on: {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                ))}

                {/* Empty State */}
                {policies.length === 0 && (
                    <div className="w-full h-auto">
                        <h1 className="text-red-500 text-xl text-center">Login Required!</h1>
                        <p className="text-gray-500 text-center col-span-full">
                            No policies available right now.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

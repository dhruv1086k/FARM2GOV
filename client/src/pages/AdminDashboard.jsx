import { useEffect, useState } from "react";
import API from "../api/axios";


export default function AdminDashboard() {
    const [farmers, setFarmers] = useState([]);


    useEffect(() => {
        API.get("/farmers/all").then(res => setFarmers(res.data));
    }, []);


    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>


            <h2 className="text-xl mt-6">All Farmers</h2>
            <ul className="mt-4 bg-gray-100 p-4 rounded">
                {farmers.map(f => (
                    <li key={f._id} className="border-b py-2">{f.name} — {f.phone} — {f.state}</li>
                ))}
            </ul>
        </div>
    );
}
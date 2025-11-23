import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function LoginAdmin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await API.post("/auth/admin/login", { email, password });
        login(res.data.token);
        navigate("/admin/dashboard");
    };


    return (
        <div className="p-10 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>


            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input className="border p-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input className="border p-2" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-green-600 text-white p-2">Login</button>
            </form>
        </div>
    );
}
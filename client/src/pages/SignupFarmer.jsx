import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignupFarmer() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [state, setState] = useState("");
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState("hi");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            await API.post("/auth/farmer/signup", {
                name,
                phone,
                password,
                state,
                email,
                language
            });

            setSuccess(true);
            setTimeout(() => navigate("/farmer/login"), 2000);

        } catch (err) {
            setError("Signup failed. Please check details.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F5E8] px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

                <h2 className="text-3xl font-extrabold text-green-800 text-center">
                    Farmer Registration
                </h2>

                {error && <p className="text-red-600 text-center mt-3">{error}</p>}
                {success && <p className="text-green-600 text-center mt-3">Signup successful!</p>}

                <form className="mt-6 space-y-5" onSubmit={handleSignup}>

                    <div>
                        <label>Full Name</label>
                        <input
                            className="w-full mt-2 p-3 border rounded-lg"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            className="w-full mt-2 p-3 border rounded-lg"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Phone Number</label>
                        <input
                            className="w-full mt-2 p-3 border rounded-lg"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>State</label>
                        <input
                            className="w-full mt-2 p-3 border rounded-lg"
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            className="w-full mt-2 p-3 border rounded-lg"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="w-full mt-2 p-3 border rounded-lg"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button className="w-full py-3 bg-green-700 text-white rounded-lg">
                        Register
                    </button>

                </form>

                <p className="text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/farmer/login" className="text-green-700 font-semibold">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

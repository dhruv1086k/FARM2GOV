import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png"

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">

                {/* Logo */}
                <a href="/">
                    <div className="w-[150px]">
                        <img src={logo} alt="" />
                    </div>
                </a>

                {/* Hamburger (mobile only) */}
                <button
                    className="md:hidden text-white text-3xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "✖" : "☰"}
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <NavItems user={user} logout={logout} />
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-green-700 px-6 pb-4 animate-slideDown">
                    <div className="flex flex-col gap-4 text-sm font-medium">
                        <NavItems user={user} logout={logout} mobile />
                    </div>
                </div>
            )}
        </nav>
    );
}

/* Reusable component for both desktop + mobile menu */
function NavItems({ user, logout, mobile }) {
    const linkStyle =
        "hover:text-yellow-300 transition-all duration-200" +
        (mobile ? " py-2 border-b border-white/20" : "");

    const buttonStyle =
        "px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition" +
        (mobile ? " text-center" : "");

    return (
        <>
            <Link to="/" className={linkStyle}>
                Home
            </Link>

            {user && user.role === "farmer" && (
                <Link to="/farmer/dashboard" className={linkStyle}>
                    Dashboard
                </Link>
            )}

            {user && user.role === "admin" && (
                <Link to="/admin/dashboard" className={linkStyle}>
                    Admin
                </Link>
            )}

            <Link to="/policies" className={linkStyle}>
                Policies
            </Link>

            {!user ? (
                <>
                    <Link to="/farmer/login" className={buttonStyle}>
                        Farmer Login
                    </Link>

                    <Link to="/admin/login" className={buttonStyle}>
                        Admin Login
                    </Link>
                </>
            ) : (
                <button
                    onClick={logout}
                    className={`px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition font-semibold ${mobile ? "text-center" : ""
                        }`}
                >
                    Logout
                </button>
            )}
        </>
    );
}

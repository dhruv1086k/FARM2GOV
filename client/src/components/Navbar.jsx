import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false); // for slide up animation

  const toggleMenu = () => {
    if (isOpen) {
      setAnimate(true);
      setTimeout(() => {
        setIsOpen(false);
        setAnimate(false);
      }, 280);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/">
          <img
            src={logo}
            alt="Farm2Gov"
            className="h-12 w-auto drop-shadow-md"
          />
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-white text-3xl transition"
          onClick={toggleMenu}
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <NavItems user={user} logout={logout} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden bg-green-700/95 px-6 pb-5 backdrop-blur-md shadow-lg 
          ${animate ? "animate-slideUp" : "animate-slideDown"}`}
        >
          <div className="flex flex-col gap-4 text-sm font-medium pt-3">
            <NavItems user={user} logout={logout} mobile />
          </div>
        </div>
      )}
    </nav>
  );
}

/* ---------- Nav Items ---------- */

function NavItems({ user, logout, mobile }) {
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 700)); // smooth loader
    logout();
  };

  return (
    <>
      <Link to="/" className="hover:text-yellow-300">
        Home
      </Link>

      {user?.role === "farmer" && (
        <Link to="/farmer/dashboard" className="hover:text-yellow-300">
          Dashboard
        </Link>
      )}

      {user?.role === "admin" && (
        <Link to="/admin/dashboard" className="hover:text-yellow-300">
          Admin
        </Link>
      )}

      <Link to="/policies" className="hover:text-yellow-300">
        Policies
      </Link>

      {!user ? (
        <>
          <Link
            to="/farmer/login"
            className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            Farmer Login
          </Link>

          {/*
            ❌ Admin login button hidden as requested
            ✔ Un-comment if needed in future:

          <Link
            to="/admin/login"
            className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            Admin Login
          </Link>
          */}
        </>
      ) : (
        <button
          onClick={logoutHandler}
          disabled={loading}
          className={`px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            mobile ? "w-full" : ""
          }`}
        >
          {loading ? (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Logout"
          )}
        </button>
      )}
    </>
  );
}

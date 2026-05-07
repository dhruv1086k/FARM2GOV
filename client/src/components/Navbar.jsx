// client/src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  FaLeaf,
  FaHome,
  FaStore,
  FaRobot,
  FaFileAlt,
  FaMicrophone,
  FaBug,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add shadow/bg opacity when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/marketplace", label: "Marketplace", icon: FaStore },
    { to: "/predict", label: "AI Predictor", icon: FaRobot },
    { to: "/policies", label: "Policies", icon: FaFileAlt },
    { to: "/voice-assistant", label: "Voice AI", icon: FaMicrophone },
    { to: "/disease-detect", label: "Disease Detect", icon: FaBug },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-green-800/95 backdrop-blur-md shadow-xl"
          : "bg-gradient-to-r from-green-800 to-green-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Farm2Gov" className="h-9 w-auto drop-shadow" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-green-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <link.icon className="text-xs" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user?.role === "farmer" && (
            <Link
              to="/farmer/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-semibold transition"
            >
              <FaTachometerAlt className="text-xs" />
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 rounded-lg text-sm font-semibold transition"
            >
              <FaTachometerAlt className="text-xs" />
              Admin Panel
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/farmer/login"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-semibold transition"
              >
                Login
              </Link>
              <Link
                to="/farmer/signup"
                className="px-4 py-2 bg-white text-green-800 rounded-lg text-sm font-bold hover:bg-green-50 shadow transition"
              >
                Register Free
              </Link>
            </>
          ) : (
            <LogoutButton logout={logout} />
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-green-800/98 backdrop-blur-md border-t border-white/10 px-4 pb-6 pt-3 space-y-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-green-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <link.icon />
                {link.label}
              </Link>
            );
          })}

          {/* Mobile auth section */}
          <div className="pt-3 border-t border-white/10 mt-2 space-y-2">
            {user?.role === "farmer" && (
              <Link
                to="/farmer/dashboard"
                className="flex items-center gap-3 px-4 py-3 bg-white/15 text-white rounded-xl text-sm font-semibold"
              >
                <FaTachometerAlt />
                My Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-4 py-3 bg-yellow-500/20 text-yellow-200 rounded-xl text-sm font-semibold"
              >
                <FaTachometerAlt />
                Admin Panel
              </Link>
            )}
            {!user ? (
              <>
                <Link
                  to="/farmer/login"
                  className="block w-full text-center px-4 py-3 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  to="/farmer/signup"
                  className="block w-full text-center px-4 py-3 bg-white text-green-800 rounded-xl text-sm font-bold hover:bg-green-50 transition"
                >
                  Register Free
                </Link>
              </>
            ) : (
              <LogoutButton logout={logout} fullWidth />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Logout Button ───────────────────────── */
function LogoutButton({ logout, fullWidth = false }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition ${
        fullWidth ? "w-full" : ""
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <FaSignOutAlt className="text-xs" />
      )}
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

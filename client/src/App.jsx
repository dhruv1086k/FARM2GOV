// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* ── Public Pages ─────────────────────────── */
import Home from "./pages/Home.jsx";
import Policies from "./pages/Policies.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import PricePredictor from "./pages/PricePredictor.jsx";
import DiseaseDetection from "./pages/DiseaseDetection.jsx";
import VoiceAssistant from "./pages/VoiceAssistant.jsx";

/* ── Farmer Auth & Dashboard ──────────────── */
import LoginFarmer from "./pages/LoginFarmer.jsx";
import SignupFarmer from "./pages/SignupFarmer.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPasswordWithOtp from "./pages/ResetPasswordWithOtp.jsx";
import FarmerDashboard from "./pages/FarmerDashboard.jsx";
import SellCrop from "./pages/SellCrop.jsx";

/* ── Admin ────────────────────────────────── */
import LoginAdmin from "./pages/LoginAdmin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminPolicies from "./pages/AdminPolicies.jsx";
import CreatePolicy from "./pages/CreatePolicy.jsx";
import EditPolicy from "./pages/EditPolicy.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global Toast Notifications */}
        <Toast />

        <Navbar />

        <Routes>
          {/* ── PUBLIC ──────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/predict" element={<PricePredictor />} />
          <Route path="/disease-detect" element={<DiseaseDetection />} />
          <Route path="/voice-assistant" element={<VoiceAssistant />} />

          {/* ── FARMER AUTH (public) ─────────── */}
          <Route path="/farmer/login" element={<LoginFarmer />} />
          <Route path="/farmer/signup" element={<SignupFarmer />} />
          <Route path="/farmer/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordWithOtp />} />

          {/* ── FARMER PROTECTED ─────────────── */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell-crop"
            element={
              <ProtectedRoute role="farmer">
                <SellCrop />
              </ProtectedRoute>
            }
          />

          {/* ── ADMIN AUTH (public) ──────────── */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* ── ADMIN PROTECTED ─────────────── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies"
            element={
              <ProtectedRoute role="admin">
                <AdminPolicies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies/create"
            element={
              <ProtectedRoute role="admin">
                <CreatePolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/policies/edit/:id"
            element={
              <ProtectedRoute role="admin">
                <EditPolicy />
              </ProtectedRoute>
            }
          />

          {/* ── 404 ─────────────────────────── */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
                <div className="text-8xl mb-6">🌿</div>
                <h1 className="text-5xl font-extrabold text-green-800 mb-3">404</h1>
                <p className="text-gray-600 text-lg mb-8">
                  Oops! This page doesn't exist.
                </p>
                <a
                  href="/"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-xl transition shadow"
                >
                  Back to Home
                </a>
              </div>
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

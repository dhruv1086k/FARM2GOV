import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";

import LoginFarmer from "./pages/LoginFarmer.jsx";
import SignupFarmer from "./pages/SignupFarmer.jsx";
import FarmerDashboard from "./pages/FarmerDashboard.jsx";

import LoginAdmin from "./pages/LoginAdmin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import Policies from "./pages/Policies.jsx";
import CreatePolicy from "./pages/CreatePolicy.jsx";
import EditPolicy from "./pages/EditPolicy.jsx";
import AdminPolicies from "./pages/AdminPolicies.jsx";

import PricePredictor from "./pages/PricePredictor.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/predict" element={<PricePredictor />} />

          {/* FARMER PUBLIC */}
          <Route path="/farmer/login" element={<LoginFarmer />} />
          <Route path="/farmer/signup" element={<SignupFarmer />} />

          {/* FARMER PROTECTED */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN PUBLIC */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* ADMIN PROTECTED */}
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

          {/* 404 */}
          <Route
            path="*"
            element={<div className="p-10">404 - Not Found</div>}
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

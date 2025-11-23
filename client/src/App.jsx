import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Home from './pages/Home.jsx';
import LoginFarmer from './pages/LoginFarmer.jsx';
import SignupFarmer from './pages/SignupFarmer.jsx';
import LoginAdmin from './pages/LoginAdmin.jsx';
import FarmerDashboard from './pages/FarmerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Policies from './pages/Policies.jsx';
import CreatePolicy from './pages/CreatePolicy.jsx';
import PricePredictor from './pages/PricePredictor.jsx';
import AuthProvider from './context/AuthContext.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Farmer auth */}
          <Route path="/farmer/login" element={<LoginFarmer />} />
          <Route path="/farmer/signup" element={<SignupFarmer />} />
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin auth */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/policies/create"
            element={
              <AdminRoute>
                <CreatePolicy />
              </AdminRoute>
            }
          />

          {/* Shared */}
          <Route path="/policies" element={<Policies />} />
          <Route path="/predict" element={<PricePredictor />} />

          {/* fallback */}
          <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

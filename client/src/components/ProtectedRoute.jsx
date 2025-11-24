import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/login" : "/farmer/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  if (role && user.role !== role) {
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/farmer/dashboard" replace />
    );
  }

  return children;
}

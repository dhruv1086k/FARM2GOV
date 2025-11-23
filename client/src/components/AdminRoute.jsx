import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If user is not logged in → redirect to login
  if (!user) return <Navigate to="/admin/login" />;

  // If logged in user is not admin → block access
  if (user.role !== "admin") return <Navigate to="/admin/login" />;

  return children;
}

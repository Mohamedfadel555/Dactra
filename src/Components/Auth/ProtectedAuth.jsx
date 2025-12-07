import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function ProtectedAuth() {
  const { accessToken, role } = useAuth();

  // Don't redirect admin - let useLogin handle the redirect
  if (accessToken) {
    const normalizedRole = role?.toLowerCase();
    if (normalizedRole === "admin" || normalizedRole === "administrator") {
      // Admin redirect is handled in useLogin hook
      return <Outlet />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

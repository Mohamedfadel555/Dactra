import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../Common/loader";

export default function ProtectedAuth() {
  const { accessToken, role, isAuthReady } = useAuth();

  console.log(isAuthReady);
  if (!isAuthReady) {
    return <Loader />;
  }
  // Don't redirect admin - let useLogin handle the redirect
  console.log(accessToken);
  if (accessToken) {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "admin" || normalizedRole === "administrator") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (normalizedRole === "lab" || normalizedRole === "lap") {
      return <Navigate to="/lab" replace />;
    }

    if (normalizedRole === "scan") {
      return <Navigate to="/scan" replace />;
    }

    // Default: send any other logged-in user to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

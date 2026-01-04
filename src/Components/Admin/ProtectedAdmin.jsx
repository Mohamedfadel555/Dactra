import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

export default function ProtectedAdmin({ children }) {
  const { accessToken, role } = useAuth();
  if (!accessToken) {
    toast.error("Please login to access admin panel", {
      position: "top-center",
      closeOnClick: true,
    });
    return <Navigate to="/auth/Login" replace />;
  }

  // Check role case-insensitively
  const normalizedRole = role?.toLowerCase();
  if (normalizedRole !== "admin" && normalizedRole !== "administrator") {
    console.log("ProtectedAdmin - Role check failed. Current role:", role); // Debug
    toast.error("Access denied. Admin privileges required.", {
      position: "top-center",
      closeOnClick: true,
    });
    return <Navigate to="/403" replace />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Common/loader";

export default function ProtectedAdmin({ children }) {
  const { accessToken, role, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <Loader />;
  }

  console.log(accessToken);
  if (!accessToken) {
    useEffect(() => {
      toast.error("Please login to access admin panel", {
        position: "top-center",
        closeOnClick: true,
      });
    }, []);

    return <Navigate to="/auth/Login" replace />;
  }

  const normalizedRole = role?.toLowerCase();
  if (normalizedRole !== "admin" && normalizedRole !== "administrator") {
    useEffect(() => {
      toast.error("Access denied. Admin privileges required.", {
        position: "top-center",
        closeOnClick: true,
      });
    }, []);

    return <Navigate to="/403" replace />;
  }

  return children;
}

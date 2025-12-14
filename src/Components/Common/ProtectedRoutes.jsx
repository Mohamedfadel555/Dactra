import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function ProtectedRoutes() {
  const { accessToken } = useAuth();
  return !accessToken ? <Navigate to="/auth" /> : <Outlet />;
}

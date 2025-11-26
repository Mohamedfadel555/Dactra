import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function ProtectedAuth() {
  const { accessToken } = useAuth();
  return accessToken ? <Navigate to="/" /> : <Outlet />;
}

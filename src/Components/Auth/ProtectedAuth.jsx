import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

export default function ProtectedAuth() {
  const { accessToken } = useAuth();
  accessToken
    ? toast.success("already Logged in", {
        position: "top-center",
        closeOnClick: true,
      })
    : null;
  return accessToken ? <Navigate to="/" /> : <Outlet />;
}

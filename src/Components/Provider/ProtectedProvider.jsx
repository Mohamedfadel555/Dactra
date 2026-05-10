import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../Common/loader";

export default function ProtectedProvider({ children, allowedRoles = [] }) {
  const { accessToken, role, isAuthReady } = useAuth();
  const hasShownDeniedToast = useRef(false);

  const normalizedRole = (
    role && typeof role === "string" ? role : ""
  ).toLowerCase();
  console.log(normalizedRole);
  const normalizedAllowed = allowedRoles.map((r) =>
    (r && typeof r === "string" ? r : "").toLowerCase(),
  );

  const isDenied =
    Boolean(isAuthReady) &&
    Boolean(accessToken) &&
    normalizedAllowed.length > 0 &&
    !normalizedAllowed.includes(normalizedRole);
  console.log(isDenied);

  useEffect(() => {
    if (!isDenied || hasShownDeniedToast.current) return;
    hasShownDeniedToast.current = true;
    toast.error("Access denied for this role.", {
      position: "top-center",
      closeOnClick: true,
    });
  }, [isDenied]);

  if (!isAuthReady) {
    return <Loader />;
  }

  if (!accessToken) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    return <Navigate to="/auth/Login" replace />;
  }

  if (isDenied) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

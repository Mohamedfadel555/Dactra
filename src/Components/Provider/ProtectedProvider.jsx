import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../Common/loader";

export default function ProtectedProvider({ children, allowedRoles = [] }) {
  const { accessToken, role, isAuthReady } = useAuth();
  const hasShownDeniedToast = useRef(false);

  console.log(role);

  const normalizedRole = (
    role && typeof role === "string" ? role : ""
  ).toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) =>
    (r && typeof r === "string" ? r : "").toLowerCase(),
  );

  if (!isAuthReady) {
    return <Loader />;
  }

  // لو مفيش توكن بس جاي من Logout ما نطلعش Toast مزعج، بس نوديه على اللوجن
  if (!accessToken) {
    return <Navigate to="/auth/Login" replace />;
  }

<<<<<<< HEAD
  const isDenied =
    normalizedAllowed.length > 0 && !normalizedAllowed.includes(normalizedRole);
=======
  if (
    normalizedAllowed.length > 0 &&
    !normalizedAllowed.includes(normalizedRole)
  ) {
    useEffect(() => {
      toast.error("Access denied for this role.", {
        position: "top-center",
        closeOnClick: true,
      });
    }, []);
>>>>>>> 4a93a4fdb80f0bb17805ca8c243d1234f0ab8cf4

  useEffect(() => {
    if (!isDenied || hasShownDeniedToast.current) return;
    hasShownDeniedToast.current = true;
    toast.error("Access denied for this role.", {
      position: "top-center",
      closeOnClick: true,
    });
  }, [isDenied]);

  if (isDenied) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import LoginPage from "./Pages/Auth/LoginPage";
import ForgotPasswordPage from "./Pages/Auth/ForgotPasswordPage";
import OTPPage from "./Pages/Auth/OTPPage";
import UpdatePasswordPage from "./Pages/Auth/UpdatePasswordPage";

export const route = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="Login" replace />,
      },
      {
        path: "Login",
        element: <LoginPage />,
      },
      {
        path: "ForgotPassword",
        element: <ForgotPasswordPage />,
      },
      {
        path: "OTPVerify",
        element: <OTPPage />,
      },
      {
        path: "UpdatePassword",
        element: <UpdatePasswordPage />,
      },
    ],
  },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import LoginPage from "./Pages/Auth/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage";
import ForgotPasswordPage from "./Pages/Auth/ForgotPasswordPage";
import OTPPage from "./Pages/Auth/OTPPage";
import UpdatePasswordPage from "./Pages/Auth/UpdatePasswordPage";
import CompleteSignupPage from "./Pages/Auth/CompleteSignupPage";

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
        path: "Signup",
        element: <SignupPage />,
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
        path: "CompleteSignup",
        element: <CompleteSignupPage />,
      },
      {
        path: "UpdatePassword",
        element: <UpdatePasswordPage />,
      },
    ],
  },
]);

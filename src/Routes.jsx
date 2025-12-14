import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loader from "./Components/Common/loader";
import HomePage from "./Pages/HomePage";
import ProtectedAuth from "./Components/Auth/ProtectedAuth";
import Profile from "./Pages/Profile/Profile";
import ProtectedRoutes from "./Components/Common/ProtectedRoutes";

const Layout = lazy(() => import("./Layout/Layout"));
const AuthLayout = lazy(() => import("./Layout/AuthLayout"));

const CallBack = lazy(() => import("./Pages/Auth/CallBack"));

const LoginPage = lazy(() => import("./Pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./Pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(() =>
  import("./Pages/Auth/ForgotPasswordPage")
);
const OTPPage = lazy(() => import("./Pages/Auth/OTPPage"));
const CompleteSignupPage = lazy(() =>
  import("./Pages/Auth/CompleteSignupPage")
);
const UpdatePasswordPage = lazy(() =>
  import("./Pages/Auth/UpdatePasswordPage")
);

const ERR404 = lazy(() => import("./Pages/Error/Error404"));
const ERR403 = lazy(() => import("./Pages/Error/Error403"));

export const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "google-callback",
        element: (
          <Suspense fallback={<Loader />}>
            <CallBack />
          </Suspense>
        ),
      },
      {
        path: "myprofile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <ProtectedAuth />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loader />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="Login" replace /> },
          {
            path: "Login",
            element: (
              <Suspense fallback={<Loader />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: "Signup",
            element: (
              <Suspense fallback={<Loader />}>
                <SignupPage />
              </Suspense>
            ),
          },
          {
            path: "ForgotPassword",
            element: (
              <Suspense fallback={<Loader />}>
                <ForgotPasswordPage />
              </Suspense>
            ),
          },
          {
            path: "OTPVerify",
            element: (
              <Suspense fallback={<Loader />}>
                <OTPPage />
              </Suspense>
            ),
          },
          {
            path: "CompleteSignup",
            element: (
              <Suspense fallback={<Loader />}>
                <CompleteSignupPage />
              </Suspense>
            ),
          },
          {
            path: "UpdatePassword",
            element: (
              <Suspense fallback={<Loader />}>
                <UpdatePasswordPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "/403",
    element: (
      <Suspense fallback={<Loader />}>
        <ERR403 />
      </Suspense>
    ),
  },
  {
    path: "/*",
    element: (
      <Suspense fallback={<Loader />}>
        <ERR404 />
      </Suspense>
    ),
  },
]);

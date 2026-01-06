import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loader from "./Components/Common/loader";
import HomePage from "./Pages/HomePage";
import ProtectedAuth from "./Components/Auth/ProtectedAuth";

import ProtectedRoutes from "./Components/Common/ProtectedRoutes";

import ProtectedAdmin from "./Components/Admin/ProtectedAdmin";
import DoctorsListPage from "./Pages/DoctorsListPage";

import MyProfile from "./Pages/Profile/MyProfile";
import Profile from "./Pages/Profile/Profile";

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

// Admin Layout and Pages
const AdminLayout = lazy(() => import("./Layout/AdminLayout"));
const DashboardPage = lazy(() => import("./Pages/Admin/DashboardPage"));
const DoctorsManagementPage = lazy(() =>
  import("./Pages/Admin/DoctorsManagementPage")
);
const PatientsManagementPage = lazy(() =>
  import("./Pages/Admin/PatientsManagementPage")
);
const LabsManagementPage = lazy(() =>
  import("./Pages/Admin/LabsManagementPage")
);
const ScansManagementPage = lazy(() =>
  import("./Pages/Admin/ScansManagementPage")
);
const ComplaintsReportsPage = lazy(() =>
  import("./Pages/Admin/ComplaintsReportsPage")
);

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
        path: "doctors",
        element: (
          <Suspense fallback={<Loader />}>
            <DoctorsListPage />
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
              <MyProfile />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "doctor/profile/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Profile role={"Doctor"} />
          </Suspense>
        ),
      },
      {
        path: "patient/profile/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <Profile role={"Patient"} />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      // {
      //   path: "lab/profile/:id",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <Profile />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: "scan/profile/:id",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <Profile />
      //     </Suspense>
      //   ),
      // },
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
    path: "/admin",
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedAdmin>
          <AdminLayout />
        </ProtectedAdmin>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "doctors",
        element: (
          <Suspense fallback={<Loader />}>
            <DoctorsManagementPage />
          </Suspense>
        ),
      },
      {
        path: "patients",
        element: (
          <Suspense fallback={<Loader />}>
            <PatientsManagementPage />
          </Suspense>
        ),
      },
      {
        path: "labs",
        element: (
          <Suspense fallback={<Loader />}>
            <LabsManagementPage />
          </Suspense>
        ),
      },
      {
        path: "scans",
        element: (
          <Suspense fallback={<Loader />}>
            <ScansManagementPage />
          </Suspense>
        ),
      },
      {
        path: "complaints",
        element: (
          <Suspense fallback={<Loader />}>
            <ComplaintsReportsPage />
          </Suspense>
        ),
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

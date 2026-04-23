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
import CommunityContainer from "./Pages/Community/CommunityContainer";
import PostDetailPage from "./Pages/Community/PostDetails";
import PaymentCallback from "./Components/Auth/PaymentCallback";
import MedicalChat from "./Pages/ChatBot";
import Doctors from "./Pages/Provider/Doctors";
import TagPostsPage from "./Pages/Community/TagPostsPage";
import OurDeals from "./Pages/Provider/OurDeals";
import SponsoredDoctors from "./Pages/Provider/SponsoredDoctors";
import ReferredPatients from "./Pages/Provider/ReferredPatients";

const Layout = lazy(() => import("./Layout/Layout"));
const AuthLayout = lazy(() => import("./Layout/AuthLayout"));

const CallBack = lazy(() => import("./Pages/Auth/CallBack"));

const LoginPage = lazy(() => import("./Pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./Pages/Auth/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("./Pages/Auth/ForgotPasswordPage"),
);
const OTPPage = lazy(() => import("./Pages/Auth/OTPPage"));
const CompleteSignupPage = lazy(
  () => import("./Pages/Auth/CompleteSignupPage"),
);
const UpdatePasswordPage = lazy(
  () => import("./Pages/Auth/UpdatePasswordPage"),
);

const ERR404 = lazy(() => import("./Pages/Error/Error404"));
const ERR403 = lazy(() => import("./Pages/Error/Error403"));

// Admin Layout and Pages
const AdminLayout = lazy(() => import("./Layout/AdminLayout"));
const DashboardPage = lazy(() => import("./Pages/Admin/DashboardPage"));
const DoctorsManagementPage = lazy(
  () => import("./Pages/Admin/DoctorsManagementPage"),
);
const PatientsManagementPage = lazy(
  () => import("./Pages/Admin/PatientsManagementPage"),
);
const LabsManagementPage = lazy(
  () => import("./Pages/Admin/LabsManagementPage"),
);
const ScansManagementPage = lazy(
  () => import("./Pages/Admin/ScansManagementPage"),
);
const ComplaintsReportsPage = lazy(
  () => import("./Pages/Admin/ComplaintsReportsPage"),
);
const AllergiesManagementPage = lazy(
  () => import("./Pages/Admin/AllergiesManagementPage"),
);
const ChronicDiseasesManagementPage = lazy(
  () => import("./Pages/Admin/ChronicDiseasesManagementPage"),
);
const MajorsManagementPage = lazy(
  () => import("./Pages/Admin/MajorsManagementPage"),
);

// Lab / Scan (Provider) Layout and Pages
const ProviderLayout = lazy(() => import("./Layout/ProviderLayout"));
const ProviderProfilePage = lazy(
  () => import("./Pages/Provider/ProviderProfilePage"),
);
const ProviderServicesPage = lazy(
  () => import("./Pages/Provider/ProviderServicesPage"),
);
const ProtectedProvider = lazy(
  () => import("./Components/Provider/ProtectedProvider"),
);

// Patient: Service Providers (Labs & Scans) list and detail
const ServiceProvidersPage = lazy(
  () => import("./Pages/ServiceProviders/ServiceProvidersPage"),
);
const ServiceProviderDetailPage = lazy(
  () => import("./Pages/ServiceProviders/ServiceProviderDetailPage"),
);
const SubmitComplaintPage = lazy(
  () => import("./Pages/Complaints/SubmitComplaintPage"),
);
const SupportHelpPage = lazy(
  () => import("./Pages/Support/SupportHelpPage"),
);
const AboutUsPage = lazy(() => import("./Pages/About/AboutUsPage"));

export const route = createBrowserRouter([
  { path: "/Dactra/Chat", element: <MedicalChat /> },
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
        path: "Community/Question/tag/:tagId/:tagName",
        element: <TagPostsPage type="Question" />,
      },
      {
        path: "Community/Artical/tag/:tagId/:tagName",
        element: <TagPostsPage type="Artical" />,
      },
      {
        path: "Community/Question/:id",
        element: (
          <ProtectedRoutes>
            <PostDetailPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "Community/Posts",
        element: (
          <ProtectedRoutes>
            <CommunityContainer type={"Artical"} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "Community/Questions",
        element: (
          <ProtectedRoutes>
            <CommunityContainer type={"Question"} />
          </ProtectedRoutes>
        ),
      },
      {
        path: "payment/callback",
        element: <PaymentCallback />,
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
      {
        path: "service-providers",
        element: (
          <Suspense fallback={<Loader />}>
            <ServiceProvidersPage />
          </Suspense>
        ),
      },
      {
        path: "labs/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ServiceProviderDetailPage />
          </Suspense>
        ),
      },
      {
        path: "complaints/submit",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <SubmitComplaintPage />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "support",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoutes>
              <SupportHelpPage />
            </ProtectedRoutes>
          </Suspense>
        ),
      },
      {
        path: "aboutus",
        element: (
          <Suspense fallback={<Loader />}>
            <AboutUsPage />
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
    path: "/admin",
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedAdmin>
          <AdminLayout />
        </ProtectedAdmin>
      </Suspense>
    ),
    // Only Admin can access; Lab/Scan get 403
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
        path: "doctors/new",
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
        path: "labs/new",
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
        path: "scans/new",
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
      {
        path: "allergies",
        element: (
          <Suspense fallback={<Loader />}>
            <AllergiesManagementPage />
          </Suspense>
        ),
      },
      {
        path: "chronic-diseases",
        element: (
          <Suspense fallback={<Loader />}>
            <ChronicDiseasesManagementPage />
          </Suspense>
        ),
      },
      {
        path: "majors",
        element: (
          <Suspense fallback={<Loader />}>
            <MajorsManagementPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/lab",
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedProvider allowedRoles={["Lab"]}>
          <ProviderLayout type="Lab" />
        </ProtectedProvider>
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/lab/profile" replace /> },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProviderProfilePage type="Lab" />
          </Suspense>
        ),
      },
      {
        path: "services",
        element: (
          <Suspense fallback={<Loader />}>
            <ProviderServicesPage type="Lab" />
          </Suspense>
        ),
      },
      {
        path: "searchdoctors",
        element: <Doctors />,
      },
      { path: "ourdeals", element: <OurDeals /> },
      { path: "sponsoreddoctors", element: <SponsoredDoctors /> },
      { path: "referredpatients", element: <ReferredPatients /> },
    ],
  },
  {
    path: "/scan",
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedProvider allowedRoles={["Scan"]}>
          <ProviderLayout type="Scan" />
        </ProtectedProvider>
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/scan/profile" replace /> },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <ProviderProfilePage type="Scan" />
          </Suspense>
        ),
      },
      {
        path: "services",
        element: (
          <Suspense fallback={<Loader />}>
            <ProviderServicesPage type="Scan" />
          </Suspense>
        ),
      },
      {
        path: "searchdoctors",
        element: <Doctors />,
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

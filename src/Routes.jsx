import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import LoginPage from "./Pages/Auth/LoginPage";

export const route = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "Login",
        element: <LoginPage />,
      },
    ],
  },
]);

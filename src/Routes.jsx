import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import LoginPage from "./Pages/Auth/LoginPage";
import SignupPage from"./Pages/Auth/SignupPage";

export const route = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "Login",
        element: <LoginPage />,
      },
       {
        path: "Signup",
        element: <SignupPage />,
      },

      
    ],
  },
]);

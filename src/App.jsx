import "./App.css";
import React, { Suspense, useEffect } from "react"; // جديد
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { route } from "./Routes";
import Loader from "./Components/Common/loader";
import { useAuth } from "./Context/AuthContext";
import { useAxios } from "./hooks/useAxios";

function App() {
  //to make user login when he refresh website or close it and return open it
  const { login, logout } = useAuth();
  const axiosInstance = useAxios();
  useEffect(() => {
    const refreshCheck = async () => {
      try {
        const res = await axiosInstance.post("account/refresh");
        console.log(res);
        const newAccessToken = res.data.accessToken;
        login(
          newAccessToken,
          JSON.parse(atob(newAccessToken.split(".")[1])).role
        );
      } catch (err) {
        console.log(err);
        logout();
      }
    };
    refreshCheck();
  }, []);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={route} />
      </Suspense>

      <ToastContainer />
    </>
  );
}

export default App;

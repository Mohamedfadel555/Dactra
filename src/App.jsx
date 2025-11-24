import "./App.css";
import React, { Suspense } from "react"; // جديد
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { route } from "./Routes";
import Loader from "./Components/Common/loader";

function App() {
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

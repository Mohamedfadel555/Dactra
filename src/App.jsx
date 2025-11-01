import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { route } from "./Routes";

function App() {
  return (
    <>
      <RouterProvider router={route} />
      <ToastContainer />
    </>
  );
}

export default App;

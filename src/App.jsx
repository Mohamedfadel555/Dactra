import "./App.css";
import { Suspense, useEffect } from "react"; // جديد
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { route } from "./Routes";
import Loader from "./Components/Common/loader";
import { useRefresh } from "./hooks/useRefresh";
import { useAuth } from "./Context/AuthContext";

function App() {
  //to make user login when he refresh website or close it and return open it
  const refreshMutation = useRefresh();
  const { setIsAuthReady } = useAuth();
  useEffect(() => {
    const init = async () => {
      try {
        await refreshMutation.mutateAsync();
      } finally {
        setIsAuthReady(true);
      }
    };
    init();
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

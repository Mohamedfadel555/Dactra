import "./App.css";
import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { route } from "./Routes";
import Loader from "./Components/Common/loader";
import { useRefresh } from "./hooks/useRefresh";
import { useAuth } from "./Context/AuthContext";
import { SponsorshipHubProvider } from "./hooks/SponsorshipHubProvider";

function App() {
  const refreshMutation = useRefresh();
  const { setIsAuthReady, accessToken, isAuthReady } = useAuth();

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
      {isAuthReady && accessToken ? (
        <SponsorshipHubProvider getToken={() => accessToken}>
          <Suspense fallback={<Loader />}>
            <RouterProvider router={route} />
          </Suspense>
        </SponsorshipHubProvider>
      ) : (
        <Suspense fallback={<Loader />}>
          <RouterProvider router={route} />
        </Suspense>
      )}
      <ToastContainer />
    </>
  );
}

export default App;

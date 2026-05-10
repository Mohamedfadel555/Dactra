import "./App.css";
import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { route } from "./Routes";
import Loader from "./Components/Common/loader";
import { useRefresh } from "./hooks/useRefresh";
import { useAuth } from "./Context/AuthContext";
import { SponsorshipHubProvider } from "./hooks/SponsorshipHubProvider";
// import { SponsorshipHubProvider } from "./sponsorship";

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
      {/* ✅ بنستنى لحد ما الـ token يجي */}
      {isAuthReady && accessToken ? (
        <SponsorshipHubProvider getToken={() => accessToken}>
          <Suspense fallback={<Loader />}>
            <RouterProvider router={route} />
          </Suspense>
        </SponsorshipHubProvider>
      ) : (
        // لو مفيش token (مش logged in) بنرندر من غير hub
        <Suspense fallback={<Loader />}>
          <RouterProvider router={route} />
        </Suspense>
      )}
      <ToastContainer />
    </>
  );
}

export default App;

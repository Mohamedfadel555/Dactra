import { Outlet } from "react-router-dom";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/Footer";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function Layout() {
  useScrollToTop();
  return (
    <div className="min-h-screen flex flex-col  relative ">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

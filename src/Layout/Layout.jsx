import { Outlet } from "react-router-dom";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen w-screen relative pt-[60px]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

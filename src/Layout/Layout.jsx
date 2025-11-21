import { Outlet } from "react-router-dom";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen relative overflow-hidden ">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

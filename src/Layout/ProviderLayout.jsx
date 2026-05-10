import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaHandsHelping } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import {
  MdPerson,
  MdMiscellaneousServices,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import Icon from "../assets/images/icons/dactraIcon.webp";
import { useLogout } from "../hooks/useLogout";
import { TbContract } from "react-icons/tb";
import { useMedicalProviderMe, pick } from "../hooks/useMedicalProviderMe";
import BrandLogo from "../Components/Common/BrandLogo";

export default function ProviderLayout({ type }) {
  const { role, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();
  const { data: provider } = useMedicalProviderMe();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth/Login");
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-[240px] bg-[#05162C] flex flex-col h-full z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 lg:p-6 flex items-center justify-between">
          <Link to="/">
            <BrandLogo textSize="text-white text-[24px] " />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 lg:px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          <NavLink
            to={"/medicalprovider/profile"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
              }`
            }
          >
            <MdPerson className="w-5 h-5" />
            <span className="text-sm font-medium truncate">Profile</span>
          </NavLink>

          <NavLink
            to={"/medicalprovider/services"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
              }`
            }
          >
            <MdMiscellaneousServices className="w-5 h-5" />
            <span className="text-sm font-medium truncate">Services</span>
          </NavLink>
          <NavLink
            to={"/medicalprovider/searchdoctors"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
              }`
            }
          >
            <FaUserDoctor className="w-5 h-5" />
            <span className="text-sm font-medium truncate">Doctors</span>
          </NavLink>
          <NavLink
            to={"/medicalprovider/ourdeals"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
              }`
            }
          >
            <TbContract className="w-5 h-5" />
            <span className="text-sm font-medium truncate">Deals</span>
          </NavLink>
          <NavLink
            to={"/medicalprovider/sponsoreddoctors"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
              }`
            }
          >
            <FaHandsHelping className="w-5 h-5" />
            <span className="text-sm font-medium truncate">Sponsored</span>
          </NavLink>
          <NavLink
            to={"/medicalprovider/referredpatients"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
              }`
            }
          >
            <FaUsers className="w-5 h-5" />
            <span className="text-sm font-medium truncate">Referred</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full h-11 px-3 rounded-lg text-red-500 hover:bg-red-900/20 transition-all duration-200 hover:scale-[1.02] font-bold"
          >
            <MdLogout className="w-5 h-5" />
            <span className="text-sm font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0 w-full lg:w-auto">
        <header className="h-16 lg:h-18 bg-white shadow-sm flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#316BE8] transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            <p className="text-sm sm:text-base font-semibold text-gray-800">
              Dashboard
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

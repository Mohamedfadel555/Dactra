import { NavLink, Link } from "react-router-dom";
import BrandLogo from "../../Components/Common/BrandLogo";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { useLogout } from "./../../hooks/useLogout";
import { IoPersonSharp } from "react-icons/io5";
import { useGetUser } from "../../hooks/useGetUser";
import { FaChevronRight } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import AvatarIcon from "./AvatarIcon1";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidenav, setSidenav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [popup, setPopup] = useState(false);
  const { data: user } = useGetUser();

  const popupRef = useRef();
  const avatarRef = useRef();

  const { accessToken } = useAuth();

  const logoutMutation = useLogout();

  useEffect(() => {
    const handleOnclickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOnclickOutside);
    return () =>
      document.removeEventListener("mousedown", handleOnclickOutside);
  }, []);

  useEffect(() => {
    const handle = () => {
      const isNowScrolled = window.scrollY > 60;

      setScrolled((prev) => {
        if (prev !== isNowScrolled) return isNowScrolled;
        return prev;
      });
    };

    window.addEventListener("scroll", handle);

    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    if (sidenav) document.body.style.overflow = "hidden";
    else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [sidenav]);

  const NavLinks = [
    { to: "/", label: "Home" },
    { to: "/fav", label: "Favourite" },
    {
      label: "Services",
      Links: [
        { to: "/service1", label: "- Service1" },
        { to: "/service2", label: "- Service2" },
        { to: "/service3", label: "- Service3" },
      ],
    },
    { to: "/doctors", label: "Doctors" },
    {
      label: "Community",
      Links: [
        { to: "/posts", label: "- Posts" },
        { to: "/questions", label: "- Questions" },
      ],
    },
    { to: "/aboutus", label: "About US" },
  ];

  async function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <>
      {/* top navbar */}
      <nav
        className={` ${
          scrolled || sidenav
            ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            : ""
        } fixed z-50 top-0 left-0 w-screen h-[60px] transition-[1s] flex items-center justify-between px-[10px] md:px-[20px]`}
      >
        {/* logo */}
        <BrandLogo
          size="w-[35px] sm:w-[40px]"
          textSize="text-[18px] sm:text-[20px]"
        />
        {/* navigation side */}
        <ul className="md:flex justify-center items-center md:gap-[5px]  lg:gap-[15px] font-english hidden">
          {NavLinks.map((i, index) =>
            i.to ? (
              i.label === "Favourite" ? null : (
                <li key={index} className="font-semibold">
                  <NavLink
                    to={i.to}
                    className={({ isActive }) =>
                      `px-3 py-1 rounded transition-all duration-200 ${
                        isActive ? "text-[#316BE8] " : "hover:text-[#316BE8]"
                      }`
                    }
                  >
                    {i.label}
                  </NavLink>
                </li>
              )
            ) : (
              <li
                key={index}
                className="cursor-pointer font-semibold flex justify-between items-center gap-1.5 relative hover:text-[#316BE8] transition-all duration-200"
                onClick={() => {
                  if (openMenu === i.label) setOpenMenu(null);
                  else setOpenMenu(i.label);
                }}
              >
                {i.label}
                <motion.span
                  animate={{ rotate: openMenu === i.label ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <HiChevronDown
                    className={`${
                      openMenu === i.label ? "text-[#316BE8]" : ""
                    }`}
                  />
                </motion.span>

                <AnimatePresence>
                  {openMenu === i.label && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute flex flex-col gap-1.5 px-4 py-2 top-[105%] left-0 shadow-lg bg-white rounded-lg border border-gray-200 min-w-[160px] z-50"
                    >
                      {i.Links.map((j, ind) => (
                        <li key={ind}>
                          <NavLink
                            to={j.to}
                            className={({ isActive }) =>
                              `block px-3 py-1 rounded transition-all duration-200 font-semibold text-gray-800 ${
                                isActive
                                  ? "text-[#316BE8] bg-[#e6f0ff]"
                                  : "hover:text-[#316BE8] hover:bg-[#f0f4ff]"
                              }`
                            }
                          >
                            {j.label}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            )
          )}
        </ul>

        <div className="flex justify-center items-center gap-[10px]">
          {/* sign in button */}

          {accessToken ? (
            <div className="relative">
              <AvatarIcon
                handle={() => {
                  setPopup((prev) => !prev);
                  setOpenMenu(null);
                }}
              />
              <AnimatePresence>
                {popup && (
                  <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className=" w-[250px] hidden md:flex  rounded-[20px] bg-[#F5F6F7] shadow-lg absolute right-[50%]  top-full p-4  flex-col gap-2 z-50"
                  >
                    {/* Header */}
                    <AvatarIcon user={user} />

                    {/* Links */}
                    <Link
                      to="/profile"
                      onClick={() => setPopup(false)}
                      className="flex justify-between items-center px-3 py-2 rounded hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <IoPersonSharp />
                        <span>Profile</span>
                      </div>
                      <FaChevronRight className="text-gray-400" />
                    </Link>

                    <Link
                      to="/favourites"
                      onClick={() => setPopup(false)}
                      className="flex justify-between items-center px-3 py-2 rounded hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <IoIosHeartEmpty />
                        <span>Favourites</span>
                      </div>
                      <FaChevronRight className="text-gray-400" />
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setPopup(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded text-red-600 hover:bg-red-50 transition font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
                        />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex justify-center items-center px-[20px] py-[8px] bg-[#316BE8] font-english font-semibold rounded-[10px] text-white text-[12px] md:text-[16px] hover:bg-[#2552c1] transition-all duration-200"
            >
              Sign in
            </Link>
          )}
          {/* menu sign */}
          <div
            className="h-fit pb-[5px] md:hidden cursor-pointer "
            onClick={() => setSidenav((prev) => !prev)}
          >
            <span
              className={`h-[3px] w-[30px] bg-[#858585] block mt-[5px] rounded-[5px] transition-[1s]  relative ${
                sidenav ? "top-2 rotate-3d" : ""
              } `}
            ></span>
            <span
              className={`h-[3px] w-[30px] bg-[#858585] block mt-[5px] rounded-[5px] transition-[1s] relative ${
                sidenav ? "opacity-[0]" : "opacity-[1]"
              }`}
            ></span>
            <span
              className={`h-[3px] w-[30px] bg-[#858585] block mt-[5px] rounded-[5px] transition-[1s]  relative ${
                sidenav ? "-top-2 rotate-3dn " : ""
              }`}
            ></span>
          </div>
        </div>
      </nav>

      {/* side nav for mobile */}
      <div
        className={`h-[calc(100vh-60px)] ${
          sidenav ? "left-0" : "left-[-100%]"
        } transition-[1s] w-[280px] sm:w-[400px] z-50 fixed  top-[60px]  md:hidden bg-white flex-col flex gap-0.5 ease-in-out`}
      >
        <AvatarIcon user={user} className="ml-[10px] mb-[10px]" />
        {NavLinks.map((i, index) =>
          i.to ? (
            <NavLink
              key={index}
              to={i.to}
              onClick={() => setSidenav(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-[#316BE8] bg-[#f2f4f8] text-[18px] h-[40px] flex items-center font-semibold px-[15px] uppercase"
                  : "bg-[#f2f4f8] text-[18px] h-[40px] flex items-center font-semibold px-[15px] uppercase"
              }
            >
              {i.label}
            </NavLink>
          ) : (
            <div className="overflow-hidden" key={index}>
              <p
                onClick={() => {
                  if (openMenu === i.label) setOpenMenu(null);
                  else setOpenMenu(i.label);
                }}
                className="bg-[#f2f4f8] cursor-pointer text-[18px] h-[40px] flex items-center justify-between font-semibold px-[15px] uppercase"
              >
                {i.label}
                <HiChevronDown
                  className={`${openMenu === i.label ? "text-[#316BE8]" : ""}`}
                />
              </p>

              <div
                className="flex flex-col duration-500 transition-all pt-px gap-px"
                style={{
                  height:
                    openMenu === i.label
                      ? `${i.Links.length * 30 + 1}px`
                      : "0px",
                }}
              >
                {i.Links.map((j, ind) => (
                  <NavLink
                    key={ind}
                    to={j.to}
                    onClick={() => setSidenav(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#316BE8] bg-[#f2f4f8] text-[14px] h-[30px] flex items-center font-semibold px-[30px] uppercase"
                        : "bg-[#f2f4f8] text-[14px] h-[30px] flex items-center font-semibold px-[30px] uppercase"
                    }
                  >
                    {j.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        )}
        {/* Logout Button */}
        {accessToken && (
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-500 text-white font-semibold 
             h-[45px] w-full flex items-center justify-center gap-2 
             text-[16px] uppercase transition-all duration-300
             active:scale-95 hover:bg-red-600 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
              />
            </svg>
            Logout
          </button>
        )}
      </div>
    </>
  );
}

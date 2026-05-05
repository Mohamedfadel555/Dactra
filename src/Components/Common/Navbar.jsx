import { NavLink, Link, useLocation } from "react-router-dom";
import BrandLogo from "../../Components/Common/BrandLogo";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../Context/AuthContext";
import { useLogout } from "./../../hooks/useLogout";
import { IoPersonSharp } from "react-icons/io5";
import { useGetUser } from "../../hooks/useGetUser";
import { FaChevronRight } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import AvatarIcon from "./AvatarIcon1";
import NotificationBell from "./NotificationBell";
import { PiCalendarDots } from "react-icons/pi";
import NotificationButton from "./../NotificationButton";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidenav, setSidenav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [popup, setPopup] = useState(false);

  const { data: user } = useGetUser();
  const { role, accessToken } = useAuth();
  const location = useLocation();
  const logoutMutation = useLogout();

  const popupRef = useRef();
  const avatarRef = useRef();
  const sidenavRef = useRef();
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handler = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      )
        setPopup(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!openMenu) return;
      const ref = dropdownRefs.current[openMenu];
      if (ref && !ref.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (
        sidenav &&
        sidenavRef.current &&
        !sidenavRef.current.contains(e.target)
      )
        setSidenav(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidenav]);

  useEffect(() => {
    setOpenMenu(null);
    setSidenav(false);
    setPopup(false);
  }, [location.pathname]);

  useEffect(() => {
    const handle = () =>
      setScrolled((prev) => {
        const next = window.scrollY > 0;
        return prev !== next ? next : prev;
      });
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  /* ── lock body scroll when sidenav open ── */
  useEffect(() => {
    document.body.style.overflow = sidenav ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidenav]);

  /* ── close sidenav on ESC ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSidenav(false);
        setOpenMenu(null);
        setPopup(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── helpers ── */
  const isParentActive = (links) =>
    links.some(
      (l) =>
        location.pathname === l.to || location.pathname.startsWith(l.to + "/"),
    );

  const handleLogout = () => {
    logoutMutation.mutate();
    setPopup(false);
    setSidenav(false);
  };

  /* ── nav links definition ── */
  const NavLinks =
    role === "Patient" || role === null
      ? [
          { to: "/", label: "Home" },
          { to: "/fav", label: "Favourite" },
          {
            label: "Services",
            Links: [
              { to: "/doctors", label: "Doctors" },
              { to: "/service-providers", label: "Labs & Scan Centers" },
            ],
          },
          {
            label: "Community",
            Links: [
              { to: "/Community/Posts", label: "Posts" },
              { to: "/Community/Questions", label: "Questions" },
            ],
          },
          { to: "/aboutus", label: "About Us" },
        ]
      : [
          { to: "/", label: "Home" },
          { to: "/fav", label: "Favourite" },
          {
            label: "Community",
            Links: [
              { to: "/Community/Posts", label: "Posts" },
              { to: "/Community/Questions", label: "Questions" },
            ],
          },
          { to: "/aboutus", label: "About Us" },
        ];

  /* ─────────────────────────────────────────
     Shared active-underline style helper
  ───────────────────────────────────────── */
  const underline =
    "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 " +
    "after:h-[2.5px] after:rounded-full after:bg-[#316BE8] " +
    "after:transition-all after:duration-300";

  return (
    <>
      {/* ══════════════════════════════════════
          TOP NAVBAR
      ══════════════════════════════════════ */}
      <nav
        className={`
          fixed z-50 top-0 left-0 w-screen h-[64px]
          flex items-center justify-between px-5 md:px-10
          transition-all duration-300
          ${
            scrolled || sidenav
              ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.07)]"
              : "bg-transparent"
          }
        `}
      >
        {/* Logo */}
        <BrandLogo
          size="w-[36px] sm:w-[42px]"
          textSize="text-[18px] sm:text-[21px]"
        />
        <NotificationButton />

        {/* ── Desktop links ── */}
        <ul className="hidden md:flex items-center gap-0.5 font-english">
          {NavLinks.map((item, index) => {
            if (item.label === "Favourite") return null;

            /* plain link */
            if (item.to) {
              return (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative flex items-center px-3.5 py-2 text-[14px] font-semibold transition-colors duration-200 ${underline} ${
                        isActive
                          ? "text-[#316BE8] after:w-[calc(100%-28px)]"
                          : "text-gray-500 hover:text-[#316BE8] after:w-0 hover:after:w-[calc(100%-28px)]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            }

            /* dropdown */
            const parentActive = isParentActive(item.Links);
            return (
              <li
                key={index}
                className="relative"
                ref={(el) => (dropdownRefs.current[item.label] = el)}
              >
                <button
                  onClick={() =>
                    setOpenMenu((prev) =>
                      prev === item.label ? null : item.label,
                    )
                  }
                  className={`
                    relative flex items-center gap-1 px-3.5 py-2
                    text-[14px] font-semibold transition-colors duration-200
                    ${underline}
                    ${
                      parentActive
                        ? `text-[#316BE8] after:w-[calc(100%-28px)]`
                        : "text-gray-500 hover:text-[#316BE8] after:w-0 hover:after:w-[calc(100%-28px)]"
                    }
                  `}
                >
                  {item.label}
                  <motion.span
                    animate={{ rotate: openMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center mt-px"
                  >
                    <HiChevronDown className="w-[15px] h-[15px]" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="
                        absolute top-[calc(100%+8px)] left-0 z-50
                        min-w-[190px] py-1.5
                        bg-white rounded-2xl
                        shadow-[0_4px_6px_rgba(0,0,0,0.04),0_16px_40px_rgba(0,0,0,0.10)]
                        border border-gray-100/80
                        overflow-hidden
                      "
                    >
                      {item.Links.map((child, ind) => (
                        <li key={ind}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 mx-1.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                                isActive
                                  ? "text-[#316BE8] bg-blue-50/80 font-semibold"
                                  : "text-gray-600 hover:text-[#316BE8] hover:bg-gray-50"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <span
                                  className={`
                                    w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200
                                    ${isActive ? "bg-[#316BE8] scale-125" : "bg-gray-300"}
                                  `}
                                />
                                {child.label}
                              </>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {accessToken && (
            <div className="hidden md:block">
              <NotificationBell />
            </div>
          )}
          {/* Avatar / Sign-in */}
          {accessToken ? (
            <div className="hidden md:block relative">
              <AvatarIcon
                ref={avatarRef}
                handle={() => {
                  setPopup((p) => !p);
                  setOpenMenu(null);
                }}
              />

              <AnimatePresence>
                {popup && (
                  <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="
                      absolute right-0 top-[calc(100%+10px)] z-50
                      w-[230px] bg-white
                      rounded-2xl border border-gray-100
                      shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_50px_rgba(0,0,0,0.12)]
                      overflow-hidden
                    "
                  >
                    {/* user header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                      <AvatarIcon user={user} />
                    </div>

                    {/* links */}
                    <div className="p-1.5">
                      {[
                        {
                          to: "/myprofile",
                          icon: <IoPersonSharp className="w-4 h-4" />,
                          label: "Profile",
                        },
                        {
                          to: "/myappointments",
                          icon: <PiCalendarDots />,
                          label: "My Appointments",
                        },
                        {
                          to: "/favourites",
                          icon: <IoIosHeartEmpty className="w-4 h-4" />,
                          label: "Favourites",
                        },
                        {
                          to: "/support",
                          icon: <IoIosHeartEmpty className="w-4 h-4" />,
                          label: "Support / Help",
                        },
                      ].map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setPopup(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 text-[13.5px] font-medium text-gray-700 group-hover:text-[#316BE8] transition-colors">
                            {icon}
                            {label}
                          </div>
                          <FaChevronRight className="w-2.5 h-2.5 text-gray-300 group-hover:text-[#316BE8] transition-colors" />
                        </Link>
                      ))}
                    </div>

                    {/* logout */}
                    <div className="px-1.5 pb-1.5">
                      <div className="h-px bg-gray-100 mx-2 mb-1.5" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/auth"
              className="
                hidden md:flex items-center gap-1.5
                px-5 py-[9px] rounded-xl
                bg-[#316BE8] text-white text-[13.5px] font-semibold
                hover:bg-[#2558d4] active:scale-95
                transition-all duration-200
                shadow-[0_2px_12px_rgba(49,107,232,0.30)]
              "
            >
              Sign in
            </Link>
          )}

          {accessToken && (
            <div className="md:hidden">
              <NotificationBell />
            </div>
          )}

          {/* Hamburger — only mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidenav((p) => !p)}
            aria-label="Toggle menu"
          >
            <span
              className={`h-[2px] w-5 bg-gray-600 rounded-full transition-all duration-300 origin-center ${sidenav ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`h-[2px] w-5 bg-gray-600 rounded-full transition-all duration-300 ${sidenav ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`h-[2px] w-5 bg-gray-600 rounded-full transition-all duration-300 origin-center ${sidenav ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <AnimatePresence>
        {sidenav && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.aside
        ref={sidenavRef}
        initial={false}
        animate={{ x: sidenav ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="
          fixed top-0 left-0 z-50 h-dvh
          w-[290px] sm:w-[340px]
          bg-white flex flex-col
          shadow-[4px_0_40px_rgba(0,0,0,0.10)]
          md:hidden
        "
      >
        {/* panel header */}
        <div className="h-[64px] shrink-0 flex items-center justify-between px-5 border-b border-gray-100">
          <BrandLogo size="w-[34px]" textSize="text-[17px]" />
          <button
            onClick={() => setSidenav(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4.5 h-4.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* user avatar row */}
        {accessToken && (
          <Link
            to="/myprofile"
            onClick={() => setSidenav(false)}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors shrink-0"
          >
            <AvatarIcon user={user} />
          </Link>
        )}

        {/* scrollable nav items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NavLinks.map((item, index) => {
            /* plain link */
            if (item.to) {
              return (
                <NavLink
                  key={index}
                  to={item.to}
                  onClick={() => setSidenav(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14.5px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "text-[#316BE8] bg-blue-50/80"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#316BE8]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* left accent bar */}
                      <span
                        className={`w-[3px] h-4 rounded-full flex-shrink-0 transition-all duration-200 ${
                          isActive ? "bg-[#316BE8]" : "bg-transparent"
                        }`}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            }

            /* dropdown */
            const parentActive = isParentActive(item.Links);
            return (
              <div key={index}>
                <button
                  onClick={() =>
                    setOpenMenu((prev) =>
                      prev === item.label ? null : item.label,
                    )
                  }
                  className={`
                    w-full flex items-center justify-between
                    px-4 py-2.5 rounded-xl
                    text-[14.5px] font-semibold transition-all duration-150
                    ${
                      parentActive
                        ? "text-[#316BE8] bg-blue-50/80"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#316BE8]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* left accent bar */}
                    <span
                      className={`w-[3px] h-4 rounded-full flex-shrink-0 transition-all duration-200 ${
                        parentActive ? "bg-[#316BE8]" : "bg-transparent"
                      }`}
                    />
                    {item.label}
                  </div>
                  <motion.span
                    animate={{ rotate: openMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <HiChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-8 pr-2 pt-1 pb-1.5 space-y-0.5">
                        {item.Links.map((child, ind) => (
                          <NavLink
                            key={ind}
                            to={child.to}
                            onClick={() => setSidenav(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                                isActive
                                  ? "text-[#316BE8] bg-blue-50/80 font-semibold"
                                  : "text-gray-500 hover:text-[#316BE8] hover:bg-gray-50"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <span
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                                    isActive
                                      ? "bg-[#316BE8] scale-125"
                                      : "bg-gray-300"
                                  }`}
                                />
                                {child.label}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="shrink-0 p-4 border-t border-gray-100">
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-2.5
                py-3 rounded-xl
                bg-red-50 text-red-500 text-[14.5px] font-semibold
                hover:bg-red-100 active:scale-[.98] transition-all duration-200
              "
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
          ) : (
            <Link
              to="/auth"
              onClick={() => setSidenav(false)}
              className="
                w-full flex items-center justify-center
                py-3 rounded-xl
                bg-[#316BE8] text-white text-[14.5px] font-semibold
                hover:bg-[#2558d4] active:scale-[.98] transition-all duration-200
                shadow-[0_2px_14px_rgba(49,107,232,0.28)]
              "
            >
              Sign in
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  );
}

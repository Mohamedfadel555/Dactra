import { NavLink, Link } from "react-router-dom";
import BrandLogo from "../../Components/Common/BrandLogo";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidenav, setSidenav] = useState(false);

  const NavLinks = [
    { to: "/", label: "Home" },
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

  return (
    <>
      {/* top navbar */}
      <nav className="absolute top-0 left-0 w-full h-[60px] flex items-center justify-between px-[10px] md:px-[20px]">
        {/* logo */}
        <BrandLogo
          size="w-[35px] sm:w-[40px]"
          textSize="text-[18px] sm:text-[20px]"
        />
        {/* navigation side */}
        <ul className="md:flex justify-center items-center gap-[15px] font-english hidden">
          {NavLinks.map((i, index) =>
            i.to ? (
              <li key={index} className="font-semibold">
                <NavLink
                  to={i.to}
                  className={({ isActive }) =>
                    `px-3 py-1 rounded transition-all duration-200 ${
                      isActive
                        ? "text-[#316BE8] bg-[#f0f4ff]"
                        : "hover:text-[#316BE8]"
                    }`
                  }
                >
                  {i.label}
                </NavLink>
              </li>
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
          <Link
            to="/auth"
            className="flex justify-center items-center px-[20px] py-[8px] bg-[#316BE8] font-english font-semibold rounded-[10px] text-white text-[12px] md:text-[16px] hover:bg-[#2552c1] transition-all duration-200"
          >
            Sign in
          </Link>
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
        } transition-[1s] w-[280px] sm:w-[400px]  absolute top-[60px]  md:hidden bg-white flex-col flex gap-0.5 ease-in-out`}
      >
        {NavLinks.map((i, index) =>
          i.to ? (
            <NavLink
              key={index}
              to={i.to}
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
      </div>
    </>
  );
}

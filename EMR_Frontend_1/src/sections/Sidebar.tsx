import React, { useEffect, useState } from "react";
import { MdDashboard, MdLogout } from "react-icons/md";
import { motion } from "framer-motion";
import { GiPillDrop, GiMedicalPack, GiVirus } from "react-icons/gi";
import { FaArrowRight, FaUserFriends } from "react-icons/fa";
import { AiOutlineTag } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import { NavItem } from "../App";

const variants = {
  expanded: { width: "20%" },
  nonExpanded: { width: "5%" },
};

const icons: Record<NavItem, React.ElementType> = {
  Dashboard: MdDashboard,
  Patients: FaUserFriends,
  Medicines: GiPillDrop,
  Diseases: GiVirus,
  EMRs: GiMedicalPack,
  Tags: AiOutlineTag,
};

const routes: Record<NavItem, string> = {
  Dashboard: "/",
  Patients: "/patients",
  Medicines: "/medicines",
  Diseases: "/diseases",
  EMRs: "/emrs",
  Tags: "/tags",
};

const Sidebar: React.FC<{
  activeNavIndex: number;
  setActiveNavIndex: (index: number) => void;
  navItems: NavItem[];
}> = ({ activeNavIndex, setActiveNavIndex, navItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = navItems.findIndex(
      (item) => routes[item] === currentPath
    );
    setActiveNavIndex(activeIndex !== -1 ? activeIndex : 0);
  }, [location, navItems, setActiveNavIndex]);

  return (
    <motion.section
      animate={isExpanded ? "expanded" : "nonExpanded"}
      variants={variants}
      className={
        "w-1/5 bg-green-300 h-screen flex flex-col justify-between items-center gap-10 relative " +
        (isExpanded ? "py-8 px-6" : "px-8 py-6")
      }
    >
      <div className="flex flex-col justify-center items-center gap-8">
        {isExpanded ? (
          <div id="logo-box">
            <h1 className="text-green-800 font-bold text-4xl">
              E-M-R <span className="italic text-green-600">App</span>
            </h1>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h1 className="text-green-800 font-bold text-3xl">E</h1>
            <span className="italic text-green-600 text-3xl">A</span>
          </div>
        )}

        <div
          id="navlinks-box"
          className="flex flex-col justify-center items-start gap-5 w-full mt-5"
        >
          {navItems.map((item, index) => (
            <NavLink
              key={item}
              to={routes[item]}
              id="link-box"
              className={
                "flex justify-start items-center gap-4 w-full cursor-pointer rounded-xl " +
                (activeNavIndex === index
                  ? "bg-green-500 text-white"
                  : "text-green-900") +
                (isExpanded ? " px-6 py-2" : " p-2")
              }
            >
              <div className="bg-green-400 text-white p-2 rounded-full">
                {React.createElement(icons[item], {
                  className: "md:w-6 w-4 h-4 md:h-6",
                })}
              </div>

              {isExpanded && (
                <span className={"text-lg" + (isExpanded ? " flex" : " hidden")}>
                  {item}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div
        id="expanded-icon"
        className="bg-green-500 text-white p-2 rounded-full cursor-pointer absolute -right-4 bottom-20 md:bottom-40 md:flex hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaArrowRight />
      </div>

      <div
        id="logout-box"
        className="w-full flex flex-col justify-start items-center gap-4 cursor-pointer"
      >
        <div className="bg-green-700 w-full h-[0.5px]"></div>
        <div className="flex justify-center items-center gap-2">
          <MdLogout className="text-green-900 h-6 w-6" />
          <span
            className={
              "text-green-900 text-lg " + (isExpanded ? "flex" : "hidden")
            }
          >
            Logout
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default Sidebar;

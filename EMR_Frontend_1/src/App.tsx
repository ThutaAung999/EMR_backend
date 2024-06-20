import React, { useState } from "react";
import Sidebar from "./sections/Sidebar";
import Main from "./sections/Main";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MantineProvider } from "@mantine/core";

export type NavItem =
  | "Dashboard"
  | "Patients"
  | "Medicines"
  | "Diseases"
  | "EMRs"
  | "Tags";

const App: React.FC = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  const navItems: NavItem[] = [
    "Dashboard",
    "Patients",
    "Medicines",
    "Diseases",
    "EMRs",
    "Tags",
  ];

  return (
    
      <main className="w-full bg-slate-200 h-screen flex justify-between items-start">
        <Sidebar
          activeNavIndex={activeNavIndex}
          setActiveNavIndex={setActiveNavIndex}
          navItems={navItems}
        />
        <Main activeNavIndex={activeNavIndex} navItems={navItems} />
      </main>

  );
};

export default App;

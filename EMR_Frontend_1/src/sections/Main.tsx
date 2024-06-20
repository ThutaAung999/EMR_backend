import React from "react";

import { NavItem } from "../App";

import Dashboard from "../components/dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Patient from "../features/patients/components/Patient";
import PatientWithProviders from "../features/patients/components/Patient";

const Main: React.FC<{ activeNavIndex: number; navItems: NavItem[] }> = ({
  activeNavIndex,
  navItems,
}) => {
  return (
    <section className="w-4/5 grow bg-white h-screen flex flex-col justify-between items-center">
      <Header />
      <div className="w-full flex-grow flex flex-col justify-start items-center gap-2 p-4">
        {navItems[activeNavIndex] === "Dashboard" && <Dashboard />}
        {navItems[activeNavIndex] === "Patients" && <PatientWithProviders />}
       
      </div>
      <Footer />
    </section>
  );
};

export default Main;

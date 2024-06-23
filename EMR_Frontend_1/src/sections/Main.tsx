import React from "react";

import { NavItem } from "../App";

import Dashboard from "../components/dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PatientList from "../features/patients/components/PatientList";
import DiseaseList from "../features/diseases/components/DiseaseList";
import MedicineList from "../features/medicine/components/MedicineList";
import EmrList from "../features/emrs/components/EmrList";
import TagList from "../features/tags/components/TagList";
//import PatientWithProviders from "../features/patients/components/PatientWithProviders";

const Main: React.FC<{ activeNavIndex: number; navItems: NavItem[] }> = ({
  activeNavIndex,
  navItems,
}) => {
  return (
    <section className="w-full grow bg-white h-screen flex flex-col justify-between items-center">
    
      <Header />
      <div className="w-full flex-grow flex flex-col justify-start items-center gap-2 p-4">
        
        {navItems[activeNavIndex] === "Dashboard" && <Dashboard />}
        {/* {navItems[activeNavIndex] === "Patients" && <PatientWithProviders />} */}
        {navItems[activeNavIndex] === "Patients" && <PatientList />}
        {navItems[activeNavIndex] === "Medicines" && <MedicineList />}  
        {navItems[activeNavIndex] === "Diseases" && <DiseaseList />}
        {navItems[activeNavIndex] === "EMRs" && <EmrList />}
        {navItems[activeNavIndex] === "Tags" && <TagList />}
       
       
      </div>
      <Footer />
    </section>
  );
};

export default Main;

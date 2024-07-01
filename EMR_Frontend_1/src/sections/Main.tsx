import React from "react";
import { NavItem } from "../App";
import Dashboard from "../components/dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PatientList from "../features/patients/components/PatientList";
import DiseaseList from "../features/diseases/components/DiseaseList";
import MedicineList from "../features/medicine/components/MedicineList";
import { EmrList } from "../features/emrs/components/EmrList";
import { Route, Routes } from "react-router-dom";
import TagList from "../features/tags/components/TagList";
import CreatePatient from "../features/patients/components/CreatePatient";
import CreateEmr from "../features/emrs/routes/CreateEmr";

const Main: React.FC<{ activeNavIndex: number; navItems: NavItem[] }> = ({
  activeNavIndex,
  navItems,
}) => {
  return (
    <section className="flex-grow h-screen overflow-auto flex flex-col justify-between items-center">
       
        <Header />
      
      <div className="w-full flex-grow flex flex-col justify-start items-center gap-2 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/create" element={<CreatePatient />} />
          <Route path="/medicines" element={<MedicineList />} />
          <Route path="/diseases" element={<DiseaseList />} />
          <Route path="/emrs" element={<EmrList />} />
          <Route path="/emrs/create" element={<CreateEmr />} />
          <Route path="/tags" element={<TagList />} />
        </Routes>
      </div>
      <Footer />
    </section>
  );
};

export default Main;

import React, { useState } from "react";
import Sidebar from "./sections/Sidebar";
import Main from "./sections/Main";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import { NAV_ITEMS } from "./constants/nav-items";
import PatientList from "./features/patients/components/PatientList";
import CreatePatient from "./features/patients/components/CreatePatient";
import UpdatePatient from "./features/patients/components/UpdatePatient";
import Dashboard from "./components/dashboard";
import MedicineList from "./features/medicine/components/MedicineList";
import DiseaseList from "./features/diseases/components/DiseaseList";
import EmrList from "./features/emrs/components/EmrList";
import TagList from "./features/tags/components/TagList";

const App: React.FC = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  return (
    <Router>
      <main className="w-full  bg-slate-200 h-screen flex justify-between items-start">
        <Sidebar
          activeNavIndex={activeNavIndex}
          setActiveNavIndex={setActiveNavIndex}
          navItems={NAV_ITEMS}
        />
        <Main activeNavIndex={activeNavIndex} navItems={NAV_ITEMS} />

        <div className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/patients" element={<PatientList />} />
            <Route path="/medicines" element={<MedicineList />} />
            <Route path="/diseases" element={<DiseaseList />} />
            <Route path="/emrs" element={<EmrList />} />
            <Route path="/tags" element={<TagList />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
};

export default App;

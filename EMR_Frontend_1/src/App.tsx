import React, { useState } from "react";
import Sidebar from "./sections/Sidebar";
import Main from "./sections/Main";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { NAV_ITEMS } from "./constants/nav-items";
import CreatePatient from "./features/patients/components/CreatePatient";

const App: React.FC = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  return (
    <Router>
      <main className="w-full  bg-slate-200 h-screen flex ">
        <Sidebar 
          activeNavIndex={activeNavIndex}
          setActiveNavIndex={setActiveNavIndex}
          navItems={NAV_ITEMS}
        />
         <Routes>
          <Route path="/" element={<Main activeNavIndex={activeNavIndex} navItems={NAV_ITEMS} />} />
          <Route path="/patients/create" element={<CreatePatient />} />
          {/* Add other routes here as needed */}
        </Routes>
        <Main activeNavIndex={activeNavIndex} navItems={NAV_ITEMS} />
      </main>
    </Router>
  );
};

export default App;

import React, { useState } from "react";
import Sidebar from "./sections/Sidebar";
import Main from "./sections/Main";

import { NAV_ITEMS } from "./constants/nav-items";

const App: React.FC = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  return (
    <main className="w-full  bg-slate-200 h-screen flex ">
      <Sidebar
        activeNavIndex={activeNavIndex}
        setActiveNavIndex={setActiveNavIndex}
        navItems={NAV_ITEMS}
      />

      <Main activeNavIndex={activeNavIndex} navItems={NAV_ITEMS} />
    </main>
  );
};

export default App;

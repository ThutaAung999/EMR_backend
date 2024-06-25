import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientList from "./features/patients/components/PatientList.tsx";
import Dashboard from "./components/dashboard.tsx";
import MedicineList from "./features/medicine/components/MedicineList.tsx";
import DiseaseList from "./features/diseases/components/DiseaseList.tsx";
import EmrList from "./features/emrs/components/EmrList.tsx";
import TagList1 from "./features/tags/components/TagList1.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

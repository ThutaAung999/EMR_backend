import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import PatientList from "./features/patients/components/PatientList.tsx";

const queryClient = new QueryClient();

<BrowserRouter>
  <Routes>
    <Route path="/" element={<App/>}/>
    <Route path="/admin/patients" element={<PatientList/>}/>
    
  </Routes>
</BrowserRouter>;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalsProvider } from "@mantine/modals";
import Patient from "./Patient"; // Adjust the import path if necessary

const queryClient = new QueryClient();

const PatientWithProviders: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Patient />
    </ModalsProvider>
  </QueryClientProvider>
);

export default PatientWithProviders;

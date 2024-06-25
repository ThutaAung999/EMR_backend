// components/PatientWithModal.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import PatientList from "./PatientList";
import CreatePatient from "./CreatePatient";

const PatientWithModal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isModalOpen = location.pathname === "/patients/create";

  const closeModal = () => navigate("/patients");

  return (
    <>
      <PatientList />
      <Modal opened={isModalOpen} onClose={closeModal} title="New Patient">
        <CreatePatient />
      </Modal>
    </>
  );
};

export default PatientWithModal;

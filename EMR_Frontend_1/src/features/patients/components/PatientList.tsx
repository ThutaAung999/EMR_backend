import React, { useState, useEffect } from "react";
import useGetPatients from "../api/get-all-patients";
import { Button, Group, Table } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { IDisease } from "../../diseases/model/IDisease";
import { IDoctor } from "../../doctors/model/IDoctor";
import { useDeletePatient } from "../api/delete-patients";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import CreatePatient from "./CreatePatient";
import { mapIdsToDiseases, mapIdsToDoctors } from "./util";

export const PatientList: React.FC = () => {
  const { data, error, isLoading } = useGetPatients();
  const mutationDelete = useDeletePatient();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [allDiseases, setAllDiseases] = useState<IDisease[]>([]);
  const [allDoctors, setAllDoctors] = useState<IDoctor[]>([]);

  useEffect(() => {
    // Fetch diseases and doctors
    const fetchDiseases = async () => {
      const response = await fetch('http://localhost:9999/api/diseases');
      const data = await response.json();
      setAllDiseases(data);
    };

    const fetchDoctors = async () => {
      const response = await fetch('http://localhost:9999/api/doctors');
      const data = await response.json();
      setAllDoctors(data);
    };

    fetchDiseases();
    fetchDoctors();
  }, []);

  const itemsPerPage = 5;
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const { active, range, setPage, next, previous } = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const currentData = data?.slice((active - 1) * itemsPerPage, active * itemsPerPage);

  const handleDelete = (id: string) => {
    setSelectedPatientId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPatientId) {
      mutationDelete.mutate(selectedPatientId);
    }
    setConfirmOpen(false);
    setSelectedPatientId(null);
  };

  const rows = currentData?.map((patient) => {
    const patientDiseases = mapIdsToDiseases(patient.diseases.map(d => d._id), allDiseases);
    const patientDoctors = mapIdsToDoctors(patient.doctors.map(d => d._id), allDoctors);

    return (
      <tr key={patient._id}>
        <td>{patient.name}</td>
        <td>{patient.age}</td>
        <td>{patientDiseases.map(disease => disease.name).join(", ")}</td>
        <td>{patientDoctors.map(doctor => doctor.name).join(", ")}</td>
        <td style={{ width: "10px", whiteSpace: "nowrap" }} >
          <Button className="text-white bg-red-600 " onClick={() => handleDelete(patient._id)}>
            Delete
          </Button>
          <Button className="text-white bg-blue-500 mx-6 " onClick={() => handleDelete(patient._id)}>
            Edit
          </Button>
        </td>
      </tr>
    );
  }) || [];

  const renderPaginationButtons = () => {
    const buttons = [];

    // Show "First" button
    if (totalPages > 1) {
      buttons.push(
        <Button onClick={() => setPage(1)} disabled={active === 1} key="first">
          First
        </Button>
      );
    }

    // Show "Previous" button
    buttons.push(
      <Button onClick={previous} disabled={active === 1} key="previous">
        <span>{`<<`}</span>
      </Button>
    );

    // Show page numbers with ellipsis
    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        buttons.push(
          <Button
            key={page}
            onClick={() => setPage(page)}
            variant={page === active ? "filled" : "outline"}
          >
            {page}
          </Button>
        );
      }
    } else {
      buttons.push(
        <Button
          key={1}
          onClick={() => setPage(1)}
          variant={1 === active ? "filled" : "outline"}
        >
          1
        </Button>
      );

      if (active > 3) {
        buttons.push(<span className="text-blue-600 " key="left-ellipsis">. . . </span>);
      }

      const startPage = Math.max(2, active - 1);
      const endPage = Math.min(totalPages - 1, active + 1);

      for (let page = startPage; page <= endPage; page++) {
        buttons.push(
          <Button
            key={page}
            onClick={() => setPage(page)}
            variant={page === active ? "filled" : "outline"}
          >
            {page}
          </Button>
        );
      }

      if (active < totalPages - 2) {
        buttons.push(<span className="text-blue-600 " key="right-ellipsis">. . .</span>);
      }

      buttons.push(
        <Button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          variant={totalPages === active ? "filled" : "outline"}
        >
          {totalPages}
        </Button>
      );
    }

    // Show "Next" button
    buttons.push(
      <Button onClick={next} disabled={active === totalPages} key="next">
        <span>{`>>`}</span>
      </Button>
    );

    // Show "Last" button
    if (totalPages > 1) {
      buttons.push(
        <Button onClick={() => setPage(totalPages)} disabled={active === totalPages} key="last">
          Last
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <CreatePatient />
      <div className="h-full w-full">
        <Table striped highlightOnHover verticalSpacing="md">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Diseases</th>
              <th>Doctors</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Group position="center" mt="md">
          {renderPaginationButtons()}
        </Group>
        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
      </div>
    </>
  );
};

export default PatientList;

import React, { useState, useEffect } from "react";
import useGetPatients from "../api/get-all-patients";
import { Button, Group, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { IDisease } from "../../diseases/model/IDisease";
import { IDoctor } from "../../doctors/model/IDoctor";
import { useDeletePatient } from "../api/delete-patients";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import CreatePatient from "./CreatePatient";
import { mapIdsToDiseases, mapIdsToDoctors } from "./util";
import { IPatient } from "../model/IPatient";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import UpdatePatient from "./UpdatePatient";

export const PatientList: React.FC = () => {
  const { data, error, isLoading } = useGetPatients();
  const mutationDelete = useDeletePatient();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  // Update
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [allDiseases, setAllDiseases] = useState<IDisease[]>([]);
  const [allDoctors, setAllDoctors] = useState<IDoctor[]>([]);

  useEffect(() => {
    // Fetch diseases and doctors
    const fetchDiseases = async () => {
      const response = await fetch("http://localhost:9999/api/diseases");
      if (!response.ok) {
        throw new Error("Failed to fetch diseases");
      }
      const allDiseases = await response.json();
      setAllDiseases(allDiseases);
    };

    const fetchDoctors = async () => {
      const response = await fetch("http://localhost:9999/api/doctors");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const allDoctors = await response.json();
      setAllDoctors(allDoctors);
    };

    fetchDiseases();
    fetchDoctors();
  }, []);

  const itemsPerPage = 10;
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const { active, range, setPage, next, previous } = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const filterPatients = (patients: IPatient[]) => {
    return patients.filter((patient) => {
      const patientDiseases = mapIdsToDiseases(
        patient.diseases.map((d) => d._id),
        allDiseases
      );
      const patientDoctors = mapIdsToDoctors(
        patient.doctors.map((d) => d._id),
        allDoctors
      );

      const diseasesText = patientDiseases
        .map((disease) => disease.name)
        .join(", ");
      const doctorsText = patientDoctors
        .map((doctor) => doctor.name)
        .join(", ");

      return (
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.age.toString().includes(searchQuery) ||
        diseasesText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctorsText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredData = filterPatients(data || []);
  const currentData = filteredData.slice(
    (active - 1) * itemsPerPage,
    active * itemsPerPage
  );

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

  const handleUpdate = (patient: IPatient) => {
    setSelectedPatient(patient);
    setUpdateModalOpen(true);
  };

  const rows =
    currentData?.map((patient) => {
      const patientDiseases = mapIdsToDiseases(
        patient.diseases.map((d) => d._id),
        allDiseases
      );
      const patientDoctors = mapIdsToDoctors(
        patient.doctors.map((d) => d._id),
        allDoctors
      );

      return (
        <tr key={patient._id}>
          <td>{patient.name}</td>
          <td>{patient.age}</td>
          <td>{patientDiseases.map((disease) => disease.name).join(", ")}</td>
          <td>{patientDoctors.map((doctor) => doctor.name).join(", ")}</td>
          <td style={{ width: "10px", whiteSpace: "nowrap" }}>
            <Button
              className="text-white bg-red-600 "
              onClick={() => handleDelete(patient._id)}
            >
              <IconTrash size={16} />
            </Button>
            <Button
              className="text-black bg-yellow-300 mx-6 "
              onClick={() => handleUpdate(patient)}
            >
              <IconEdit size={16} />
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
        buttons.push(
          <span className="text-blue-600 " key="left-ellipsis">
            . . .{" "}
          </span>
        );
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
        buttons.push(
          <span className="text-blue-600 " key="right-ellipsis">
            . . .
          </span>
        );
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
        <Button
          onClick={() => setPage(totalPages)}
          disabled={active === totalPages}
          key="last"
        >
          Last
        </Button>
      );
    }

    return buttons;
  };

  return (
    <section className="h-full w-full">
      <div className="flex flex-row justify-between items-start  min-w-full ">
        <CreatePatient />
        <TextInput
          className=" w-80 "
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb="md"
          icon={<IconSearch size={16} />}
        />
      </div>

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
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        {updateModalOpen && selectedPatient && (
          <UpdatePatient
            patient={selectedPatient}
            closeModal={() => setUpdateModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default PatientList;

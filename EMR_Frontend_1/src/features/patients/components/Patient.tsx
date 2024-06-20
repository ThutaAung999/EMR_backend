import React, { useMemo, useState } from "react";

//import { useCreatePatient } from "../api/create-patient";

import useGetPatients, { fetchPatients } from "../api/get-all-patients";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { IPatient } from "../model/IPatient";
import { IDoctor } from "../../doctors/model/IDoctor";
import { IDisease } from "../../diseases/model/IDisease";

import {
  MRT_EditActionButtons,
  MantineReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
} from "mantine-react-table";

import {
  ActionIcon,
  Button,
  Flex,
  Stack,
  MultiSelect,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

import { ModalsProvider, modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useGetDoctors } from "../../doctors/api/get-all-doctors";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";

export const usePatients = () => {
  return useQuery<IPatient[], Error>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
};

const Patient: React.FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const { data: doctors } = useGetDoctors();
  const { data: diseases } = useGetDiseases();
  //-----------------------------------------------

  //----------------------------------------------
  const columns = useMemo<MRT_ColumnDef<IPatient>[]>(
    () => [
      /* {
        accessorKey: '_id',
        header: 'ID',
        enableEditing: false,
        size: 80,
      }, */
      {
        accessorKey: "name",
        header: "Name",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: "age",
        header: "Age",
        mantineEditTextInputProps: {
          type: "number",
          required: true,
          error: validationErrors?.age,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              age: undefined,
            }),
        },
      },
      {
        accessorKey: "diseases",
        header: "Diseases",
        Cell: ({ cell }) => {
          const patient = cell.row.original as IPatient;
          return (
            <ul>
              {(patient.diseases as IDisease[]).map((disease) => (
                <li key={disease._id}>
                  {disease.name}: {disease.description}
                </li>
              ))}
            </ul>
          );
        },

        Edit: ({ cell, row }) => {
          const selectedDiseases = (cell.getValue() as IDisease[]) || [];
          return (
            <MultiSelect
              data={(diseases || []).map((disease) => ({
                value: disease._id,
                label: disease.name,
              }))}
              value={selectedDiseases.map((disease) => disease._id)} //error
              onChange={(selectedIds) => {
                const selectedDiseases = selectedIds.map((id) =>
                  diseases?.find((disease) => disease._id === id)
                );
                row._valuesCache.diseases = selectedDiseases;
              }}
            />
          );
        },
      },
      {
        accessorKey: "doctors",
        header: "Doctors",

        Cell: ({ cell }) => {
          const patient = cell.row.original as IPatient;
          return (
            <ul>
              {(patient.doctors as IDoctor[]).map((doctor) => (
                <li key={doctor._id}>
                  {doctor.name} ({doctor.specialty})
                </li>
              ))}
            </ul>
          );
        },

        Edit: ({ cell, row }) => {
          const selectedDoctors = (cell.getValue() as IDoctor[]) || [];
          return (
            <MultiSelect
              data={(doctors || []).map((doctor) => ({
                value: doctor._id,
                label: doctor.name,
              }))}
              value={selectedDoctors.map((doctor) => doctor._id)}
              onChange={(selectedIds) => {
                const selectedDoctors = selectedIds.map((id) =>
                  doctors?.find((doctor) => doctor._id === id)
                );
                row._valuesCache.doctors = selectedDoctors;
              }}
            />
          );
        },
      },
    ],
    [validationErrors, diseases, doctors]
  );

  // call CREATE hook
  const { mutateAsync: createPatient, isLoading: isCreatingPatient } =
    useCreatePatient();
  // call READ hook
  const {
    data: fetchPatients = [],
    isError: isLoadingPatientsError,
    isFetching: isFetchingPatients,
    isLoading: isLoadingPatients,
  } = useGetPatients();
  //data fetching from backend MongoDB
  const { data, error, isLoading } = useGetPatients();

  // call UPDATE hook
  const { mutateAsync: updatePatient, isLoading: isUpdatingPatient } =
    useUpdatePatient();
  // call DELETE hook
  const { mutateAsync: deletePatient, isLoading: isDeletingPatient } =
    useDeletePatient();

  //CREATE action
  const handleCreatePatient: MRT_TableOptions<IPatient>["onCreatingRowSave"] =
    async ({ values, exitCreatingMode }) => {
      const newValidationErrors = validatePatient(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      const payload = {
        ...values,
        age: Number(values.age), // Convert age to number
        diseases: values.diseases.map((disease: IDisease) => disease._id), // Send only IDs
        doctors: values.doctors.map((doctor: IDoctor) => doctor._id), // Send only IDs
      };

      try {
        await createPatient(payload);
        exitCreatingMode();
      } catch (error) {
        console.error("Error creating patient", error);
      }
    };

  // UPDATE action
  const handleSavePatient: MRT_TableOptions<IPatient>["onEditingRowSave"] =
    async ({ values, row, table }) => {
      const newValidationErrors = validatePatient(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      // Ensure the _id field is included
      values._id = row.original._id;
      // Adjust payload to send only IDs
      const payload = {
        ...values,
        age: Number(values.age), // Convert age to number
        diseases: values.diseases.map((disease: IDisease) => disease._id), // Send only IDs
        doctors: values.doctors.map((doctor: IDoctor) => doctor._id), // Send only IDs
      };

      try {
        await updatePatient(payload);
        table.setEditingRow(null); // exit editing mode
      } catch (error) {
        console.error("Error updating patient", error);
      }
    };

  // DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<IPatient>) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this patient?",
      children: (
        <Text>
          Are you sure you want to delete {row.original.name}? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deletePatient(row.original._id),
    });

  const table = useMantineReactTable({
    columns,
    data: data || [], // Ensure data is not undefined (use empty array if undefined)
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row._id,
    mantineToolbarAlertBannerProps: isLoadingPatientsError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    mantineTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },

    mantinePaginationProps: {
      rowsPerPageOptions: ["5", "10", "15"],
      withEdges: true, //note: changed from `showFirstLastButtons` in v1.0
    },

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreatePatient,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSavePatient,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New Patient</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Patient</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Patient
      </Button>
    ),

    state: {
      isLoading: isLoadingPatients,
      isSaving: isCreatingPatient || isUpdatingPatient || isDeletingPatient,
      showAlertBanner: isLoadingPatientsError,
      showProgressBars: isFetchingPatients,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <MantineReactTable table={table} />;
};

// CREATE hook (post new patient to api)
function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patient: IPatient) => {
      /* mutationFn: async (patient: Omit<IPatient, 'diseases' | 'doctors'>
         & { diseases: string[], doctors: string[] }) => {       */
      const response = await fetch("http://localhost:9999/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server error:", errorResponse);

        throw new Error("Network response was not ok");
      }
      return response.json();
    },

    onMutate: (newPatientInfo: IPatient) => {
      queryClient.setQueryData<IPatient[]>(
        ["patients"],
        (prevPatients = []) => [
          ...prevPatients,
          {
            ...newPatientInfo,
            // _id: (Math.random() + 1).toString(36).substring(7),
          },
        ]
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
    onSuccess: () => {
      console.log("Success");
    },
    onError: () => {
      console.log("Error creating patient");
    },
  });
}

// READ hook (get patients from api)

//import useGetPatients ,{fetchPatients} from "../api/get-all-patients";
/* function useGetPatients() {
  return useQuery<IPatient[]>({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    refetchOnWindowFocus: false,
  });
}
 */
// UPDATE hook (put patient in api)
function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patient: IPatient) => {
      const response = await fetch(
        `http://localhost:9999/api/patients/${patient._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patient),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onMutate: (newPatientInfo: IPatient) => {
      queryClient.setQueryData<IPatient[]>(["patients"], (prevPatients = []) =>
        prevPatients.map((prevPatient) =>
          prevPatient._id === newPatientInfo._id ? newPatientInfo : prevPatient
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}

// DELETE hook (delete patient in api)
function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patientId: string) => {
      const response = await fetch(
        `http://localhost:9999/api/patients/${patientId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onMutate: (patientId: string) => {
      queryClient.setQueryData<IPatient[]>(["patients"], (prevPatients = []) =>
        prevPatients.filter((patient) => patient._id !== patientId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}

const queryClient = new QueryClient();
const PatientWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <Patient />
    </ModalsProvider>
  </QueryClientProvider>
);

export default PatientWithProviders;

const validateRequired = (value: string) => !!value.length;
const validatePatient = (patient: IPatient) => {
  return {
    name: !validateRequired(patient.name) ? "Name is Required" : "",
    //age: !validateRequired(patient.age+'') ? "Age is Required" : "",

    age: !patient.age ? "Age is Required" : "",
  };
};

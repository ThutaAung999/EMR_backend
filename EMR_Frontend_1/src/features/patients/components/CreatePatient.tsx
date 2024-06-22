import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextInput,
  MultiSelect,
  Stack,
  NumberInput,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useCreatePatient } from "../api/create-patient";
import { IPatient } from "../model/IPatient";
import useGetPatients from "../api/get-all-patients";
import { IconUserPlus } from "@tabler/icons-react";

const CreatePatient: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPatient>({
    defaultValues: {
      name: "",
      age: 0,
      diseases: [],
      doctors: [],
    },
  });

  const mutation = useCreatePatient(() => {
    close(); // Close the modal on success
    reset(); // Reset the form values
  });

  const onSubmit = (data: IPatient) => {
    const transformedData = {
      ...data,
      diseases: data.diseases.map((disease) => disease._id),
      doctors: data.doctors.map((doctor) => doctor._id),
    };
    mutation.mutate(transformedData);
  };

  const [opened, { open, close }] = useDisclosure(false);

  const { data, error, isLoading } = useGetPatients();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  const diseaseOptions =
    data
      ?.flatMap((patient) => patient.diseases)
      .filter(
        (disease, index, self) =>
          self.findIndex((d) => d._id === disease._id) === index
      )
      .map((disease) => ({ value: disease._id, label: disease.name })) || [];

  const doctorOptions =
    data
      ?.flatMap((patient) => patient.doctors)
      .filter(
        (doctor, index, self) =>
          self.findIndex((d) => d._id === doctor._id) === index
      )
      .map((doctor) => ({ value: doctor._id, label: doctor.name })) || [];

  return (
    <>
      <Modal opened={opened} onClose={close} title="New Patient">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextInput
                  label="Name"
                  placeholder="Enter patient name"
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              name="age"
              control={control}
              rules={{ required: "Age is required", min: 1 }}
              render={({ field }) => (
                <NumberInput
                  label="Age"
                  placeholder="Enter patient age"
                  {...field}
                  error={
                    errors.age
                      ? "Age is required and must be a positive number"
                      : null
                  }
                />
              )}
            />

            <Controller
              name="diseases"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={diseaseOptions}
                  label="Diseases"
                  placeholder="Select diseases"
                  value={field.value.map((disease: any) => disease._id)}
                  onChange={(values) =>
                    field.onChange(values.map((id) => ({ _id: id })))
                  }
                  error={
                    errors.diseases && "Please select at least one disease"
                  }
                />
              )}
            />

            <Controller
              name="doctors"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={doctorOptions}
                  label="Doctors"
                  placeholder="Select doctors"
                  value={field.value.map((doctor: any) => doctor._id)}
                  onChange={(values) =>
                    field.onChange(values.map((id) => ({ _id: id })))
                  }
                  error={errors.doctors && "Please select at least one doctor"}
                />
              )}
            />

            <div className="flex flex-row gap-6 justify-end">
              <Button onClick={close}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </Stack>
        </form>
      </Modal>

      <Stack align="center">
        <Button onClick={open} leftIcon={<IconUserPlus size={18} />}>
          New Patient
        </Button>
      </Stack>
    </>
  );
};

export default CreatePatient;

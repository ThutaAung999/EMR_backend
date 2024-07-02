import React from "react";
import { Controller } from "react-hook-form";
import { MultiSelect, Textarea } from "@mantine/core";
import { useGetDiseases } from "../../../diseases/api/get-all-diseases";
import { useGetMedicines } from "../../../medicine/api/get-all-medicines";
import useGetPatients from "../../../patients/api/get-all-patients";

const FormFields: React.FC<{
  control: any;
  errors: any;
}> = ({ control, errors }) => {
  const { data: diseases } = useGetDiseases();
  const { data: medicines } = useGetMedicines();
  const { data: patients } = useGetPatients();

  const diseaseOptions =
    diseases
      ?.filter(
        (disease, index, self) =>
          disease &&
          disease._id &&
          self.findIndex((d) => d?._id === disease._id) === index
      )
      .map((disease) => ({ value: disease._id, label: disease.name })) || [];

  const patientOptions =
    patients
      ?.filter(
        (patient, index, self) =>
          patient &&
          patient._id &&
          self.findIndex((d) => d?._id === patient._id) === index
      )
      .map((patient) => ({ value: patient._id, label: patient.name })) || [];

  const medicineOptions =
    medicines
      ?.filter(
        (medicine, index, self) =>
          medicine &&
          medicine._id &&
          self.findIndex((d) => d?._id === medicine._id) === index
      )
      .map((medicine) => ({ value: medicine._id, label: medicine.name })) || [];

  return (
    <>
      <Controller
        name="diseases"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={diseaseOptions}
            label="Diseases"
            placeholder="Select diseases"
            value={field.value}
            onChange={(values) => field.onChange(values)}
            error={errors.diseases && "Please select at least one disease"}
          />
        )}
      />

      <Controller
        name="medicines"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={medicineOptions}
            label="Medicine"
            placeholder="Select medicine"
            value={field.value}
            onChange={(values) => field.onChange(values)}
            error={errors.medicines && "Please select at least one medicine"}
          />
        )}
      />

      <Controller
        name="patients"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={patientOptions}
            label="Patient"
            placeholder="Select patients"
            value={field.value}
            onChange={(values) => field.onChange(values)}
            error={errors.patients && "Please select at least one patient"}
          />
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Note :"
            autosize
            minRows={2}
            maxRows={4}
            placeholder="Enter your notes"
            {...field}
            error={errors.notes?.message}
          />
        )}
      />
    </>
  );
};

export default FormFields;

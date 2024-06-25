import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateMedicine } from "../api/create-medicine";
import { IMedicine } from "../model/IMedicine";
import { Button, Modal, MultiSelect, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGetMedicines } from "../api/get-all-medicines";
import { IconUserPlus } from "@tabler/icons-react";

const CreateMedicine: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMedicine>({
    defaultValues: {
      name: "",
      manufacturer: "",
      diseases: [],
    },
  });

  const mutation = useCreateMedicine(() => {
    close();
    reset();
  });


  const onSubmit = (data: IMedicine) => {
    const transformedData = {
      ...data,
      diseases: data.diseases.map((disease) => disease._id),
    };
    mutation.mutate(transformedData);
  };

  const [opened, { open, close }] = useDisclosure(false);

  const { data, error, isLoading } = useGetMedicines();


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  console.log(data)
  // Prepare disease options
  const diseaseOptions =
    data?.flatMap((medicine) => medicine.diseases) // Flatten diseases from all medicines
      .filter((disease, index, self) => self.findIndex((d) => d._id === disease._id) === index) // Remove duplicates
      .map((disease) => ({ value: disease._id, label: disease.name })) || []; // Map to value-label pairs

      console.log(diseaseOptions);


  return (
    <>
      <Modal opened={opened} onClose={close} title="New Medicine">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="md">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextInput
                  label="Name"
                  placeholder="Enter medicine name"
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              name="manufacturer"
              control={control}
              rules={{ required: "Manufacturer is required" }}
              render={({ field }) => (
                <TextInput
                  label="Manufacturer"
                  placeholder="Enter manufacturer"
                  {...field}
                  error={errors.manufacturer?.message}
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
                  error={errors.diseases && "Please select at least one disease"}
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
          New Medicine
        </Button>
      </Stack>
    </>
  );
};

export default CreateMedicine;

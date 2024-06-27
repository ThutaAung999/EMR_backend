import React, { useState } from "react";
import { Button, MultiSelect, Stack, Textarea, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { IEmrDTO, EmrImage } from "../model/emr.model"; // Ensure EmrImage is imported
import { useCreateEmr } from "../api/create-emr";
import useGetEmrs from "../api/get-all-emrs";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";
import { useGetMedicines } from "../../medicine/api/get-all-medicines";
import useGetPatients from "../../patients/api/get-all-patients";
import axios from "axios";

const CreateEmr: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEmrDTO>({
    defaultValues: {
      medicines: [],
      diseases: [],
      patients: [],
      emrImages: [],
      notes: "",
    },
  });

  const { data: emrs, error, isLoading } = useGetEmrs();
  const {
    data: diseases,
    error: diseaseError,
    isLoading: diseaseIsLoading,
  } = useGetDiseases();
  const {
    data: medicines,
    error: medicineError,
    isLoading: medicineIsLoading,
  } = useGetMedicines();
  const {
    data: patients,
    error: patientError,
    isLoading: patientIsLoading,
  } = useGetPatients();

  const mutation = useCreateEmr(() => {
    close();
    reset();
  });

  const [uploadedImages, setUploadedImages] = useState<EmrImage[]>([]);

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await axios.post("http://localhost:9999/api/emrs/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
      const { images } = res.data;
      const newImages: EmrImage[] = images.map((image: { image: string }) => ({
        image: image.image,
        tags: [],
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = (data: IEmrDTO) => {
    data.emrImages = uploadedImages;
    mutation.mutate(data);
  };

  if (isLoading || diseaseIsLoading || medicineIsLoading || patientIsLoading)
    return <div>Loading...</div>;
  if (error || diseaseError || medicineError || patientError)
    return <div>Error</div>;

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
    <section className="h-full w-full">
      <div className="flex flex-col justify-between items-start min-w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
          encType="multipart/form-data"
        >
          <Stack>
            <Controller
                name="emrImages"
                control={control}
                render={({ field }) => (
                    <div>
                      <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            handleImageUpload(e);
                            field.onChange(uploadedImages);
                          }}
                      />
                      <div className="mt-2">
                        {uploadedImages.map((image, index) => (
                            <div key={index}>
                              <img
                                  src={`/api/emrs/${image.image}`}
                                  alt="Uploaded"
                                  style={{ width: "100px", margin: "10px" }}
                              />
                            </div>
                        ))}
                      </div>
                    </div>
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
                  value={field.value}
                  onChange={(values) => field.onChange(values)}
                  error={
                    errors.diseases && "Please select at least one disease"
                  }
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
                  error={
                    errors.medicines && "Please select at least one medicine"
                  }
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
                  error={
                    errors.patients && "Please select at least one patient"
                  }
                />
              )}
            />

            <Controller
              name="notes"
              control={control}
              rules={{ required: "NOTES is required" }}
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



            <div className="flex flex-row gap-6 justify-end">
              <Button onClick={close}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </Stack>
        </form>
      </div>
    </section>
  );
};

export default CreateEmr;

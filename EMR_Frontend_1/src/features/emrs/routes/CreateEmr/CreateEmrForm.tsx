import React, { useState, useRef } from "react";
import { Button, Stack } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { IEmrDTO, EmrImage } from "../../model/emr.model";
import { useCreateEmr } from "../../api/create-emr";
import useGetEmrs from "../../api/get-all-emrs";
import { useGetDiseases } from "../../../diseases/api/get-all-diseases";
import { useGetMedicines } from "../../../medicine/api/get-all-medicines";
import useGetPatients from "../../../patients/api/get-all-patients";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaPlus } from "react-icons/fa";
import { useGetTags } from "../../../tags/api/get-all-tags";
import axios from "axios";
import ImageUploadModal from "./ImageUploadModal";
import SelectedImages from "./SelectedImages";
import FormFields from "./FormFields";

const CreateEmrForm: React.FC = () => {
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

  const navigate = useNavigate(); // Initialize useNavigate
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const { data: tags, error: tagError, isLoading: tagIsLoading } = useGetTags();


//    if (tags) console.log("Tags: ", JSON.stringify(tags, null, 2));


  const mutation = useCreateEmr(() => {
    reset();
    setUploadedImages([]); // Clear uploaded images
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    navigate("/emrs"); // Navigate to the desired route after saving
  });

  const [uploadedImages, setUploadedImages] = useState<EmrImage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:9999/api/emrs/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { images } = res.data;
      const newImages: EmrImage[] = images.map((image: { image: string }) => ({
        image: image.image,
        tags: selectedTags, // Add selected tags to the uploaded image
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
      setSelectedTags([]); // Reset tags after saving
      setModalOpen(false); // Close modal after saving
      setSelectedFiles([]); // Clear selected files
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove the image from selected files if not uploaded yet
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // Remove the image from uploaded images if already uploaded
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: IEmrDTO) => {
    data.emrImages = uploadedImages;
    mutation.mutate(data);
  };

  if (
    isLoading ||
    diseaseIsLoading ||
    medicineIsLoading ||
    patientIsLoading ||
    tagIsLoading
  )
    return <div>Loading...</div>;
  if (error || diseaseError || medicineError || patientError || tagError)
    return <div>Error</div>;

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
                <div className="flex flex-row items-center">
                  <Button
                    leftIcon={<FaPlus />}
                    onClick={() => setModalOpen(true)}
                  >
                    Add Item
                  </Button>
                  <SelectedImages
                    uploadedImages={uploadedImages}
                    handleRemoveImage={handleRemoveImage}
                  />
                </div>
              )}
            />
            <FormFields control={control} errors={errors} />
            <div className="flex flex-row gap-6 justify-end">
              <Button onClick={() => navigate("/emrs")}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </Stack>
        </form>
      </div>

      <ImageUploadModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        fileInputRef={fileInputRef}
        handleImageSelect={handleImageSelect}
        selectedFiles={selectedFiles}
        handleImageUpload={handleImageUpload}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tags={tags}
      />
    </section>
  );
};

export default CreateEmrForm;

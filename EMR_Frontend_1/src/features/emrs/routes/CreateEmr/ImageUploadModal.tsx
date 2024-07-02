import React from "react";
import { Modal, Stack, Button, MultiSelect } from "@mantine/core";

const ImageUploadModal: React.FC<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: (files: FileList | null) => void;
  selectedFiles: File[];
  handleImageUpload: () => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: { value: string; label: string }[];
}> = ({
  modalOpen,
  setModalOpen,
  fileInputRef,
  handleImageSelect,
  selectedFiles,
  handleImageUpload,
  selectedTags,
  setSelectedTags,
  tags,
}) => {
  const dropdownStyles = {
    dropdown: {
      maxHeight: "80px",
      overflowY: "auto",
    },
  };

  console.log("tags inside the ImageUpload:", tags);

  return (
    <Modal
      opened={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Upload Image and Tags"
    >
      <Stack>
        <Button onClick={() => fileInputRef.current?.click()}>Add Photo</Button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleImageSelect(e.target.files)}
        />
        <div className="mt-4 flex flex-row flex-wrap gap-4">
          {selectedFiles.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt="Selected"
              className="w-48 h-48"
            />
          ))}
        </div>
        {tags.length > 0 ? (
          <MultiSelect
            data={tags}
            label="Tags"
            placeholder="Select tags"
            value={selectedTags}
            onChange={setSelectedTags}
            styles={dropdownStyles}
          />
        ) : (
          <p>No tags available</p>
        )}
        <div className="flex flex-row gap-6 justify-end mt-4">
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleImageUpload}>Save</Button>
        </div>
      </Stack>
    </Modal>
  );
};

export default ImageUploadModal;

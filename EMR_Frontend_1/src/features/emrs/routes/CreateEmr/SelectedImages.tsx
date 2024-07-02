import React from "react";
import { EmrImage } from "../../model/emr.model";
import { FaTimes } from "react-icons/fa";

const SelectedImages: React.FC<{
  uploadedImages: EmrImage[];
  handleRemoveImage: (index: number) => void;
}> = ({ uploadedImages, handleRemoveImage }) => {
  return (
    <div className="mt-2 flex flex-row items-center w-30 h-30 rounded-full ms-4">
      {uploadedImages.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={`http://localhost:9999/${image.image}`} // Correct image path
            alt="Uploaded"
            className="w-24 h-24 rounded-full"
            style={{ margin: "10px" }}
          />
          <button
            className="absolute top-0 right-0"
            onClick={() => handleRemoveImage(index)} // Pass index to handleRemoveImage
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedImages;

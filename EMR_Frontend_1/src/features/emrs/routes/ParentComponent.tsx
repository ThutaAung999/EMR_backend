import React, { useState } from "react";
import UpdateEmr from "../routes/UpdateEmr"; // Adjust the import path as needed
import { IEmrDTO } from "../model/emr.model"; // Adjust the import path as needed

const ParentComponent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(true); // Control the modal visibility

  const dummyEmr: IEmrDTO = {
    _id: "emr123",
    patients: ["patient1"],
    diseases: ["disease1"],
    medicines: ["medicine1"],
    emrImages: [
      {
        image: "dummyImagePath1.jpg",
        tags: ["tag1"],
      },
    ],
    notes: "Sample notes",
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {modalOpen && <UpdateEmr emr={dummyEmr} closeModal={closeModal} />}
    </div>
  );
};

export default ParentComponent;

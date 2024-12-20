import EMRImage, { IEMR_Image } from '../model/emr_image.model';

export const getAllEMRImage = async (): Promise<IEMR_Image[]> => {
  return EMRImage.find().exec();
};

export const getEMRImageById = async (
  emrImageId: string,
): Promise<IEMR_Image | null> => {
  return EMRImage.findById(emrImageId).exec();
};

export const newEMRImage = async (
  emrImage: IEMR_Image,
): Promise<IEMR_Image> => {
  const newEMRImage = new EMRImage(emrImage);
  return newEMRImage.save();
};

export const updateEMRImage = async (
  emrImageId: string,
  emrImage: IEMR_Image,
): Promise<IEMR_Image> => {
  const newEMRImage = <IEMR_Image>(
    await EMRImage.findByIdAndUpdate(emrImageId, emrImage, { new: true })
  );

  //return newDisease as IPatient;   //   This way  works  also.
  return newEMRImage;
};

export const deleteEMRImage = async (
  emrImageId: String,
): Promise<IEMR_Image> => {
  const deletedEMRImage = await EMRImage.findByIdAndDelete(emrImageId);

  return deletedEMRImage as IEMR_Image;
};

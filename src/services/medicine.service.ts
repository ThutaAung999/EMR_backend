import MedicineModel, { IMedicine } from '../model/medicine.model';
import { GetQueryForPagination } from './GetQueryForPagination';
import Disease from '../model/diasease.model';

//before updating
export const getAllMidicine = async (): Promise<IMedicine[]> => {
  return MedicineModel.find().populate('diseases').exec();
};

//------------------------------------------------------------------------------------------------
//after updating

export const getAllMedicinesWithPagination = async (
  query: GetQueryForPagination,
): Promise<{ data: IMedicine[]; total: number }> => {
  const { page, limit, search, sortBy, sortOrder } = query;

  const matchQuery: any = {};

  const searchQuery = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { manufacturer: { $regex: search, $options: 'i' } },
          {
            diseases: {
              $in: await Disease.find({
                name: { $regex: search, $options: 'i' },
              }).select('_id'),
            },
          },
        ],
      }
    : {};

  const sortQuery = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : {};

  const [data, total] = await Promise.all([
    MedicineModel.find(searchQuery)
      .sort(sortQuery as { [key: string]: 1 | -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('diseases')
      .exec(),
    MedicineModel.countDocuments(searchQuery).exec(),
  ]);

  return { data, total };
};

//-----------------------------------------------------------------------------------------

export const getMedicineById = async (
  medicineId: string,
): Promise<IMedicine | null> => {
  return MedicineModel.findById(medicineId).populate('diseases').exec();
};

export const searchMedicineByName = async (
  medicineName: string,
): Promise<IMedicine[]> => {
  return MedicineModel.find({
    name: {
      $regex: medicineName,
      $options: 'i', // Case insensitive search
    },
  }).exec();
};

export const newMedicine = async (medicine: IMedicine): Promise<IMedicine> => {
  const newMedicine = new MedicineModel(medicine);
  return newMedicine.save();
};

export const updateMedicine = async (
  medicineId: string,
  medicine: IMedicine,
): Promise<IMedicine> => {
  const newMedicine = <IMedicine>(
    await MedicineModel.findByIdAndUpdate(medicineId, medicine, { new: true })
  );

  return newMedicine;
};

export const deleteMedicine = async (
  medicineId: String,
): Promise<IMedicine> => {
  const deletedMedicine = await MedicineModel.findByIdAndDelete(medicineId);

  return deletedMedicine as IMedicine;
};

export default {
  getAllMidicine,
  getMedicineById,
  searchMedicineByName,
  newMedicine,
  updateMedicine,
  deleteMedicine,
};

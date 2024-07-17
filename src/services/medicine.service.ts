import MedicineModel,{IMedicine} from "../model/medicine.model";
import {IRequest, IResponse} from "../types/types";
import Patient, {IPatient} from "../model/patient.model";
import {getAllPatient} from "./patient.service";


//before updating
export const getAllMidicine = async (): Promise<IMedicine[]> => {
    return MedicineModel.find().
        populate("diseases").exec();
};


//------------------------------------------------------------------------------------------------

//after updating

interface GetMedicinesQuery {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
  
  export const getAllMedicinesWithPagination = async (
    query: GetMedicinesQuery
  ): Promise<{ data: IMedicine[]; total: number }> => {
    const { page, limit, search, sortBy, sortOrder } = query;
  
    const searchQuery = search
        ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { manufacturer: { $regex: search, $options: "i" } }
          ]
        }
        : {};
    const sortQuery = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};
  
    const [data, total] = await Promise.all([
      MedicineModel.find(searchQuery)
      .sort(sortQuery as { [key: string]: 1 | -1 }) // Type assertion here  
        .skip((page - 1) * limit)
        .limit(limit)
          .populate('diseases')
        .exec(),
      MedicineModel.countDocuments(searchQuery)
          .exec(),
    ]);
  
    return { data, total };
  };
  
  //-----------------------------------------------------------------------------------------
  



export const getMedicineById = async (medicineId: string): Promise<IMedicine | null> => {
    return MedicineModel.findById(medicineId).populate('diseases').exec();
};


export const searchMedicineByName = async (medicineName: string): Promise<IMedicine[]> => {
    return MedicineModel.find({
        name: {
            $regex: medicineName,
            $options: 'i'  // Case insensitive search
        }
    }).exec();
};

export const newMedicine = async (medicine: IMedicine): Promise<IMedicine> => {
    const newMedicine = new MedicineModel(medicine);
    return newMedicine.save();
};


export const updateMedicine = async(medicineId : string , medicine : IMedicine) :Promise<IMedicine>=>{
    const newMedicine = <IMedicine>await MedicineModel.findByIdAndUpdate(medicineId,medicine,{new:true});

    return newMedicine;
}

export const deleteMedicine = async(medicineId: String):Promise<IMedicine>=>{
    const deletedMedicine = await MedicineModel.findByIdAndDelete(medicineId);

    return deletedMedicine as IMedicine;
}



export default {
    getAllMidicine,
    getMedicineById,
    searchMedicineByName,
    newMedicine,
    updateMedicine,
    deleteMedicine,

};
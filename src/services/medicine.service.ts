import MedicineModel,{IMedicine} from "../model/medicine.model";
import {IRequest, IResponse} from "../types/types";
import Patient, {IPatient} from "../model/patient.model";
import {getAllPatient} from "./patient.service";



export const getAllMidicine = async (): Promise<IMedicine[]> => {
    return MedicineModel.find().
        populate("diseases").exec();
};

export const getMedicineById = async (medicineId: string): Promise<IMedicine | null> => {
    return MedicineModel.findById(medicineId).exec();
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
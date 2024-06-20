import Disease ,{IDisease} from "../model/diasease.model";
import Patient, {IPatient} from "../model/patient.model";

export const getAllDiseases = async () : Promise<IDisease[]> =>{
    return Disease.find().exec();
}

export const getDiseaseById = async (diseaseId : string) : Promise<IDisease | null> =>{
    return Disease.findById(diseaseId).exec();
}


export const newDisease = async (disease: IDisease): Promise<IDisease> => {
    const newDisease = new Disease(disease);
    return newDisease.save();
};


export const updateDisease = async(diseaseId : string , disease : IDisease) :Promise<IDisease>=>{
    const newDisease = <IDisease>await Disease.findByIdAndUpdate(diseaseId,disease,{new:true});

    //return newDisease as IPatient;   //   This way  works  also.
    return newDisease;
}

export const deleteDisease = async(diseaseId: String):Promise<IDisease>=>{
    const deletedDisease = await Disease.findByIdAndDelete(diseaseId);

    return deletedDisease as IDisease;
}

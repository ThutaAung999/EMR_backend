import Patient, {IPatient } from '../model/patient.model';
import {zodPatientUpdateSchema} from '../schema/patient.schema'

export const getAllPatient = async (): Promise<IPatient[]> => {
    return Patient.find()
    .populate('doctors')
    .populate('diseases').exec();
};

export const getPatientById = async (patientId: string): Promise<IPatient | null> => {
    return Patient.findById(patientId).exec();
};


/****************/
export const searchPatientByName = async (patientName: string): Promise<IPatient[]> => {
    try {
        console.log(`Searching for patients with name matching: ${patientName}`);
        const patients = await Patient.find({
            name: {
                $regex: new RegExp(patientName, 'i')  // Case insensitive search
            }
        }).exec();

        console.log('Found patients:', patients);  // Log the found patients
        return patients;
    } catch (error) {
        console.error('Error searching patients:', error);
        throw error;  // Throw the error to be handled by the calling function
    }
};

/****************/

export const newPatient = async (patient: IPatient): Promise<IPatient> => {

    console.log("new patient in PatientService : ", patient);

    try {
        const newPatient = new Patient(patient);
        return await newPatient.save();
    } catch (error) {
        if (error) {

            console.log(" error :", error)
            throw new Error(JSON.stringify(error));
        }
        throw error;
    }
};


export const updatePatient = async (patientId: string, patient: IPatient): Promise<IPatient> => {

    zodPatientUpdateSchema.parse(patient);
    
    try{

    const newPatient = <IPatient>await Patient.findByIdAndUpdate(patientId, {
        ...patient,
        updatedAt: new Date(), // Ensure updatedAt is updated
      
    },
        {new: true});

   /*
   //this is oririnal code
   const newPatient = <IPatient>await Patient.findByIdAndUpdate(patientId, patient,
         {new: true});
    */
         
         return newPatient as IPatient;   //   This way  works  also.
    
 //   return newPatient;
    }catch (error) {
        // Handle error appropriately
        console.error('Error updating patient:', error);
        throw error;
      }


}
export const deletePatient = async (patientId: String): Promise<IPatient> => {
    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    return deletedPatient as IPatient;
}


export default {
    getAllPatient,
    getPatientById,
    searchPatientByName,
    newPatient,
    updatePatient,
    deletePatient,

};
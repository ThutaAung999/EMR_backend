import DoctorModel , {IDoctor} from "../model/doctor.model";

export const getAllDoctors = async () : Promise<IDoctor[]> =>{
    return DoctorModel.find().populate("patients").exec();
}

export const getDoctorById = async (doctorId : string) : Promise<IDoctor | null> =>{
    return DoctorModel.findById(doctorId).exec();
}


export const newDoctor = async (doctor: IDoctor): Promise<IDoctor> => {
    const newDoctor = new DoctorModel(doctor);
    return newDoctor.save();
};


export const updateDoctor = async(doctorId : string , doctor : IDoctor) :Promise<IDoctor>=>{

    const newDoctor = <IDoctor>await DoctorModel.findByIdAndUpdate(doctorId,
        {
            ...doctor,
            updatedAt: new Date(),
        }
        ,{new:true});

    console.log("newDoctor",newDoctor)
    return newDoctor as IDoctor;
}

export const deleteDoctor = async(doctorId: String):Promise<IDoctor>=>{
    const deletedDoctor = await DoctorModel.findByIdAndDelete(doctorId);

    return deletedDoctor as IDoctor;
}

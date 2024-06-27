import EmrModel ,{IEMR} from '../model/emr.model'

export const getAllEMR = async () : Promise<IEMR[]> =>{
    return EmrModel.find().
        populate("diseases").
        populate("medicines").
        populate("patients").exec();
}

export const getEMRById = async (emrId : string) : Promise<IEMR | null> =>{

    return EmrModel.findById(emrId).exec();
}



export const newEMR = async (emr: IEMR): Promise<IEMR> => {
    const newEMR = new EmrModel(emr);
    return newEMR.save();
};


export const updateEMR = async(emrId : string , emr : IEMR) :Promise<IEMR>=>{
    const newEMR = <IEMR>await EmrModel.findByIdAndUpdate(emrId,emr,{new:true});

    //return newEMR as IEMR;   //   This way  works  also.
    return newEMR;
}

export const deleteEMR = async(emrId: String):Promise<IEMR>=>{
    const deletedEMR = await EmrModel.findByIdAndDelete(emrId);

    return deletedEMR as IEMR;
}

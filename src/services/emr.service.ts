import EmrModel ,{IEMR} from '../model/emr.model'

//before updating
export const getAllEMR = async () : Promise<IEMR[]> =>{
    return EmrModel.find().
        populate("diseases").
        populate("medicines").
        populate("patients").
        populate('emrImages.tags').
    exec();
}


//================================================================================================
//after updating

interface GetEmrsQuery {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }

  export const getAllEmrsWithPagination = async (
    query: GetEmrsQuery
  ): Promise<{ data: IEMR[]; total: number }> => {
    const { page, limit, search, sortBy, sortOrder } = query;
    
    
    const searchQuery = search
        ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { manufacturer: { $regex: search, $options: "i" } },
              { "diseases.name": { $regex: search, $options: "i" } },
              { "medicines.name": { $regex: search, $options: "i" } },
              { "patients.name": { $regex: search, $options: "i" } },
    
          ]
        }
        : {};

    const sortQuery = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};
  
    const [data, total] = await Promise.all([
      EmrModel.find(searchQuery)
      .sort(sortQuery as { [key: string]: 1 | -1 }) // Type assertion here  
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('diseases')
        .populate('medicines')
        .populate('patients')
        .exec(),
      EmrModel.countDocuments(searchQuery)
          .exec(),
    ]);
  
    return { data, total };
  };
  

//================================================================================================================








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

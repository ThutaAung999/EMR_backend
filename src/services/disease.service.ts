import Disease, { IDisease } from "../model/diasease.model";

//before updating
export const getAllDiseases = async (): Promise<IDisease[]> => {
  return Disease.find().exec();
};

//------------------------------------------------------------------------------------------------

//after updating

interface GetDiseasesQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllDiseasesWithPagination = async (
  query: GetDiseasesQuery
): Promise<{ data: IDisease[]; total: number }> => {
  const { page, limit, search, sortBy, sortOrder } = query;

  const searchQuery = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { "diseases.name": { $regex: search, $options: "i" } }
        ]
      }
      : {};
  const sortQuery = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};

  const [data, total] = await Promise.all([
    Disease.find(searchQuery)
    .sort(sortQuery as { [key: string]: 1 | -1 }) // Type assertion here  
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('medicines')
      .exec(),
    Disease.countDocuments(searchQuery).exec(),
  ]);

  return { data, total };
};

//-----------------------------------------------------------------------------------------
export const getDiseaseById = async (
  diseaseId: string
): Promise<IDisease | null> => {
  return Disease.findById(diseaseId).exec();
};

export const newDisease = async (disease: IDisease): Promise<IDisease> => {
  const newDisease = new Disease(disease);
  return newDisease.save();
};

export const updateDisease = async (
  diseaseId: string,
  disease: IDisease
): Promise<IDisease> => {
  console.log("disease :", disease);
  const newDisease = <IDisease>(
    await Disease.findByIdAndUpdate(diseaseId, disease, { new: true })
  );

  return newDisease;
};

export const deleteDisease = async (diseaseId: String): Promise<IDisease> => {
  const deletedDisease = await Disease.findByIdAndDelete(diseaseId);

  return deletedDisease as IDisease;
};

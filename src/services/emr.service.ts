import EmrModel, { IEMR } from '../model/emr.model';
import { GetQueryForPagination } from './GetQueryForPagination';
import Disease from '../model/diasease.model';
import MedicineModel from '../model/medicine.model';
import Patient from '../model/patient.model';

//before updating
export const getAllEMR = async (): Promise<IEMR[]> => {
  return EmrModel.find()
    .populate('diseases')
    .populate('medicines')
    .populate('patients')
    .populate('emrImages.tags')
    .exec();
};
//================================================================================================
//after updating
export const getAllEmrsWithPagination = async (
  query: GetQueryForPagination,
): Promise<{ data: IEMR[]; total: number }> => {
  const { page, limit, search, sortBy, sortOrder } = query;

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
          {
            medicines: {
              $in: await MedicineModel.find({
                name: { $regex: search, $options: 'i' },
              }).select('_id'),
            },
          },
          {
            patients: {
              $in: await Patient.find({
                name: { $regex: search, $options: 'i' },
              }).select('_id'),
            },
          },
        ],
      }
    : {};

  const sortQuery = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : {};

  const [data, total] = await Promise.all([
    EmrModel.find(searchQuery)
      .sort(sortQuery as { [key: string]: 1 | -1 }) // Type assertion here
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('diseases')
      .populate('medicines')
      .populate('patients')
      .exec(),
    EmrModel.countDocuments(searchQuery).exec(),
  ]);

  return { data, total };
};

//================================================================================================================

export const getEMRById = async (emrId: string): Promise<IEMR | null> => {
  return EmrModel.findById(emrId).exec();
};

export const newEMR = async (emr: IEMR): Promise<IEMR> => {
  const newEMR = new EmrModel(emr);
  return newEMR.save();
};

export const updateEMR = async (emrId: string, emr: IEMR): Promise<IEMR> => {
  const newEMR = <IEMR>await EmrModel.findByIdAndUpdate(
    emrId,
    {
      ...emr,
      updatedAt: new Date(),
    },
    { new: true },
  );

  //return newEMR as IEMR;   //   This way  works  also.
  return newEMR;
};

export const deleteEMR = async (emrId: String): Promise<IEMR> => {
  const deletedEMR = await EmrModel.findByIdAndDelete(emrId);

  return deletedEMR as IEMR;
};

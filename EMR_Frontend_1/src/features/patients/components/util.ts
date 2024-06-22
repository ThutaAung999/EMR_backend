import { IDisease } from "../../diseases/model/IDisease";
import { IDoctor } from "../../doctors/model/IDoctor";

export const mapIdsToDiseases = (ids: string[], diseases: IDisease[]): IDisease[] => {
  return ids.map(id => diseases.find(disease => disease._id === id)).filter(disease => disease !== undefined) as IDisease[];
};

export const mapIdsToDoctors = (ids: string[], doctors: IDoctor[]): IDoctor[] => {
  return ids.map(id => doctors.find(doctor => doctor._id === id)).filter(doctor => doctor !== undefined) as IDoctor[];
};

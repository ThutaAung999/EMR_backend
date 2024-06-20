import { IPatient } from "../../patients/model/IPatient";

/* 
export interface IDisease {
    _id: string; 
    name: string;
    description: string;
    patients: string[];
    medicines: string[];
  }
 */  
  export type IDisease ={
    _id: string; 
    name: string;
    description: string;
    //patients: string[];
    patients: IPatient[];
    //medicines: string[];
    medicines: unknown[];
  }

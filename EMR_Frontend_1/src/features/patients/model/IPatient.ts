import { IDisease } from "../../diseases/model/IDisease";
import { IDoctor } from "../../doctors/model/IDoctor";

export type IPatient ={
    _id: string; 
    name: string;
    age: number;
    //doctors: string[];
    doctors: IDoctor[];
    //diseases: string[];
    diseases:IDisease[];
  }
  
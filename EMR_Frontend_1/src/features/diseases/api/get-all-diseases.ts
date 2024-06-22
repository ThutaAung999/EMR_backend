import { useQuery } from "@tanstack/react-query";
import { IDisease } from "../model/IDisease";
import { IPatient } from "../../patients/model/IPatient";

// Fetch diseases
export const fetchDiseases = async () => {
    const response = await fetch("http://localhost:9999/api/diseases");
    if (!response.ok) {
      throw new Error("Failed to fetch diseases");
    }
    return response.json();
  };
  
  export const useGetDiseases = () => {
    return useQuery<IDisease[], Error>({
        queryKey: ['diseases'],
        queryFn: fetchDiseases,
        refetchOnWindowFocus: false,
    });
};
  /* export const useGetDiseases = () => {
    return useQuery<IDisease[], Error>("diseases", fetchDiseases);
  };
   */
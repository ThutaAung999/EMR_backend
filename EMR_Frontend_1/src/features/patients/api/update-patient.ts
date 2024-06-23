/* import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPatient } from "../model/IPatient";

// UPDATE hook (put patient in api)
export function useUpdatePatient() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (patient: IPatient) => {
        const response = await fetch(
          `http://localhost:9999/api/patients/${patient._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(patient),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
      onMutate: (newPatientInfo: IPatient) => {
        queryClient.setQueryData<IPatient[]>(["patients"], (prevPatients = []) =>
          prevPatients.map((prevPatient) =>
            prevPatient._id === newPatientInfo._id ? newPatientInfo : prevPatient
          )
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
    });
  }
   */


// api/update-patient.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IPatient } from "../model/IPatient";

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  const updatePatient = useMutation({
    mutationFn: async (updatedPatient: IPatient) => {
      const response = await fetch(`http://localhost:9999/api/patients/${updatedPatient._id}`, {
        method: "PATCH", // or "PUT" if you prefer full update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  return updatePatient;
}

/******************************* */

const fetchDiseases = async () => {
  const response = await fetch('http://localhost:9999/api/diseases');
  if (!response.ok) {
    throw new Error('Failed to fetch diseases');
  }
  return response.json();
};

export const useGetDiseases = () => {
  return useQuery({
    queryKey: ['diseases'],
    queryFn: fetchDiseases
  });
};


const fetchDoctors = async () => {
  const response = await fetch('http://localhost:9999/api/doctors');
  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }
  return response.json();
};

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors
  });
};
/******************************* */

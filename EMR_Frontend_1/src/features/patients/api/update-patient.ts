import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  
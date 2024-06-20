//----------------------------------------------------------------

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPatient } from "../model/IPatient";

export function useCreatePatient() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (patient: IPatient) => {//should use DTO

        const response = await fetch("'http://localhost:9999/api/patients'", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',  // Add this header
              },
            body: JSON.stringify(patient), 
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        return response.json();
      },
      //client side optimistic update
      onMutate: (newPatientInfo: IPatient) => {
        queryClient.setQueryData(
          ['patients'],
          (prevUsers: IPatient[]) =>
            [
              ...prevUsers,
              {
                ...newPatientInfo,
                
              },
            ] as IPatient[],
        );
      },
       onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
  }
  
  
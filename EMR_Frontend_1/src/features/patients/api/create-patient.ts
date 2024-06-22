//----------------------------------------------------------------
// CREATE hook (post new patient to api)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPatient } from "../model/IPatient";

export function useCreatePatient(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (patient: IPatient) => {//should use DTO

        const response = await fetch('http://localhost:9999/api/patients', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',  // Add this header
              },
            body: JSON.stringify(patient), 
        });
        if (!response.ok) {
           console.log('response :',response);

            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        return response.json();
      },

      //To handle routers
      /* onSuccess: () => {
        queryClient.invalidateQueries(['patients']);
        navigate("/admin/patients");
    },
    onError: (error) => {
        const errorData = JSON.parse(error.message);
        setValidationErrors(errorData);
    }, */

      //client side optimistic update
      onMutate: (newPatientInfo: IPatient) => {
        queryClient.setQueryData(
          ['patients'],
          (prevPatients: IPatient[]) =>
            [
              ...prevPatients,
              {
                ...newPatientInfo,
                
              },
            ] as IPatient[],
        );
      },
       onSettled: () => queryClient.invalidateQueries({ queryKey: ['patients'] }), //refetch users after mutation, disabled for demo
    
       onSuccess: () => {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      },
      });
  }
  
  
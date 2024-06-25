import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";
import { useNavigate } from "react-router-dom";
import { IMedicineDTO } from "../DTO/IMedicineDTO";



export function useCreateMedicine(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (medicine: IMedicineDTO) => {
      const response = await fetch("http://localhost:9999/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      return response.json();
    },

    onMutate: (newMedicineInfo: IMedicineDTO) => {
      queryClient.setQueryData(
        ["medicines"],
        (prevMedicines: IMedicine[] = []) => [
          ...prevMedicines,
          {
            ...newMedicineInfo,
          },
        ] as IMedicine[]
      );
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ["medicines"] }),

    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      navigate("/medicines");
    },
  });
}

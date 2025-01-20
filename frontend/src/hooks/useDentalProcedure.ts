import { useQuery } from "@tanstack/react-query";
import { GetAllDentalProcedureReq, GetAllDentalProcedureRes } from "../types";
import { GetAllDentalProceduresApi } from "../fetch/api";
import { ApiError } from "../fetch/ApiError";

export const useDentalProcedures = () => {
  return useQuery<GetAllDentalProcedureReq, ApiError, GetAllDentalProcedureRes>(
    ["services"],
    GetAllDentalProceduresApi,
    {},
  );
};

// export const useVisitDentalProcedure = (
//   visitDentalProcedure: VisitDentalProcedure,
// ) => {
//   const queryClient = new QueryClient();

//   const mutate = useMutation<recordVisitDentalProcedureReq, ApiError>(
//     RecordVisitDentalProcedureApi(visitDentalProcedure),
//     {
//       onSuccess: () => queryClient.invalidateQueries(["visitDentalProcedures"]),
//     },
//   );

//   return { mutate };
// };

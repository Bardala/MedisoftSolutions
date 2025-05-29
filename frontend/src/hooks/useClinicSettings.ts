// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   GetClinicSettingsApi,
//   CreateClinicSettingsApi,
//   UpdateClinicSettingsApi,
// } from "../apis/clinicSettingsApis";
// import { IClinicSettings } from "../types";
// import { ApiError } from "../fetch/ApiError";

// export const useGetClinicSettings = () => {
//   const query = useQuery<IClinicSettings, ApiError>(
//     ["clinic-settings"],
//     GetClinicSettingsApi,
//   );

//   return { query };
// };

// export const useCreateClinicSettings = () => {
//   const queryClient = useQueryClient();

//   const createMutation = useMutation<
//     IClinicSettings,
//     ApiError,
//     IClinicSettings
//   >((settings) => CreateClinicSettingsApi(settings), {
//     onSuccess: () => {
//       queryClient.invalidateQueries(["clinic-settings"]);
//     },
//   });

//   return { createMutation };
// };

// export const useUpdateClinicSettings = () => {
//   const queryClient = useQueryClient();

//   const updateMutation = useMutation<
//     IClinicSettings,
//     ApiError,
//     IClinicSettings
//   >((settings) => UpdateClinicSettingsApi(settings), {
//     onSuccess: () => {
//       queryClient.invalidateQueries(["clinic-settings"]);
//     },
//   });

//   return { updateMutation };
// };

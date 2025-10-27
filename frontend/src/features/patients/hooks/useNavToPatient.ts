import { buildRoute } from "@/shared/utils";
import { useNavigate } from "react-router-dom";

export const useNavToPatient = () => {
  const nav = useNavigate();
  return (patientId: string | number) => {
    patientId = String(patientId);
    nav(buildRoute("PATIENT_PAGE", { id: patientId }));
  };
};

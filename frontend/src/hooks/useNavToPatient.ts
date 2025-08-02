import { useNavigate } from "react-router-dom";
import { buildRoute } from "../utils/routeUtils";

export const useNavToPatient = () => {
  const nav = useNavigate();
  return (patientId: string | number) => {
    patientId = String(patientId);
    nav(buildRoute("PATIENT_PAGE", { id: patientId }));
  };
};

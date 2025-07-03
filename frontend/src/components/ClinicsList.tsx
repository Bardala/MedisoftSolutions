import { useGetAllClinics } from "../hooks/useClinic";
import { useIntl } from "react-intl";
import { ClinicsTable } from "./ClinicsTable";

export const ClinicsList = ({ setSelectedOption }) => {
  const { formatMessage: f } = useIntl();
  const { data: clinics, isLoading } = useGetAllClinics();

  if (isLoading) return <div>{f({ id: "loading" })}</div>;

  return (
    <div className="clinics-page">
      <div className="clinics-header">
        <h2>{f({ id: "all_clinics" })}</h2>
      </div>

      <ClinicsTable clinics={clinics || []} />

      <div className="clinics-actions">
        {clinics?.map((clinic) => (
          <div key={clinic.id} className="clinic-actions"></div>
        ))}
      </div>
    </div>
  );
};

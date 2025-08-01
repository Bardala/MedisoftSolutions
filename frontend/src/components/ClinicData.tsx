import { useGetClinic } from "../hooks/useClinic";
import "../styles/clinicData.css";
import { ClinicLimits } from "./ClinicLimits";
import { ClinicStaff } from "./ClinicStaff";

interface ClinicDataProps {
  clinicId: number;
  // onBack: () => void;
}

export const ClinicData = ({ clinicId }: ClinicDataProps) => {
  const { data: clinic, isLoading } = useGetClinic(clinicId);

  if (isLoading) return <div>Loading clinic data...</div>;

  return (
    <div className="clinic-page">
      <div className="clinic-header">
        {/* <button onClick={onBack}>Back to Clinics</button> */}
        <h1>{clinic?.name}</h1>
        {clinic?.logoUrl && (
          <img src={clinic.logoUrl} alt="Clinic Logo" className="clinic-logo" />
        )}
      </div>

      <div className="clinic-details">
        <h2>Clinic Information</h2>
        <div className="detail-item">
          <span>Address:</span> {clinic?.address || "Not specified"}
        </div>
        <div className="detail-item">
          <span>Phone:</span> {clinic?.phoneNumber || "Not specified"}
        </div>
        <div className="detail-item">
          <span>Email:</span> {clinic?.email || "Not specified"}
        </div>
        <div className="detail-item">
          <span>Working Hours:</span> {clinic?.workingHours || "Not specified"}
        </div>
      </div>

      <ClinicLimits clinicId={clinicId} />
      <ClinicStaff clinicId={clinicId} />
    </div>
  );
};

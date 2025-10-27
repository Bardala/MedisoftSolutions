import { useParams } from "react-router-dom";
import { useGetClinic } from "../hooks/useClinic";

const ClinicDetails = () => {
  const { id } = useParams();
  const { data: clinic, isLoading } = useGetClinic(Number(id));

  if (isLoading) return <div>Loading clinic...</div>;
  if (!clinic) return <div>Clinic not found</div>;

  return (
    <div>
      <h2>Clinic Details</h2>
      <p>
        <strong>Name:</strong> {clinic.name}
      </p>
      <p>
        <strong>Address:</strong> {clinic.address}
      </p>
      <p>
        <strong>Email:</strong> {clinic.email}
      </p>
      <p>
        <strong>Phone:</strong> {clinic.phoneNumber}
      </p>
      <p>
        <strong>WhatsApp Support:</strong>{" "}
        {clinic.phoneSupportsWhatsapp ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default ClinicDetails;

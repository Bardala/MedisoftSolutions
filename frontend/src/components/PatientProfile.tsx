import { useState, useEffect } from "react";
import UserFiles from "./UserFiles";
import "../styles/patientProfile.css";
import { useQueue } from "../hooks/useQueue";
import { usePatientRegistry } from "../hooks/useRegistry";
import { Patient } from "../types";
import "../styles/patientProfile.css";
import { VisitCard } from "./VisitCard";

const CurrentPatientProfile = () => {
  const { queue, isLoading, isError } = useQueue(1);
  const [currPatient, setCurrPatient] = useState<Patient | null>(null);
  const visits = usePatientRegistry(currPatient?.id)?.patientRegistryQuery.data
    ?.visits;
  const visit = visits ? visits[visits.length - 1] : null; // Current visit
  const lastVisit =
    visits && visits.length > 1 ? visits[visits.length - 2] : null; // Last visit

  useEffect(() => {
    if (queue && queue.length > 0) {
      setCurrPatient(queue[0].patient);
    }
  }, [queue]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: Something went wrong...</p>;

  return (
    <div className="patient-profile-container">
      <h2>Current Patient Profile</h2>
      {currPatient ? (
        <>
          <div className="patient-info">
            <p>
              <strong>Name:</strong> {currPatient.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {currPatient.phone}
            </p>
            <p>
              <strong>Medical History:</strong>{" "}
              {currPatient.medicalHistory || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {currPatient.address || "N/A"}
            </p>
            <p>
              <strong>Patient Notes:</strong>
              {currPatient.notes || "N/A"}
            </p>
          </div>

          {visit && <VisitCard visit={visit} currVisit={true} />}
          {lastVisit && <VisitCard visit={lastVisit} currVisit={false} />}

          <UserFiles patientId={currPatient.id} />
        </>
      ) : (
        <p>No current patient found.</p>
      )}
    </div>
  );
};

export default CurrentPatientProfile;

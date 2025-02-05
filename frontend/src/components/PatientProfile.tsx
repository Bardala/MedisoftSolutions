import { useState, useEffect } from "react";
import UserFiles from "./UserFiles";
import "../styles/patientProfile.css";
import { usePatientRegistry } from "../hooks/useRegistry";
import { Patient } from "../types";
import { VisitCard } from "./VisitCard";
import {
  useFetchQueue,
  useUpdateQueueStatus,
  useRemovePatientFromQueue,
} from "../hooks/useQueue";
import { callNextPatient, callPatientForDoctor } from "../utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Medicines } from "./Medicines";
import PatientProfileHeader from "./PatientProfileHeader";
import { PrescriptionPrint } from "./PrescriptionPrint"; // Import the PrescriptionPrint component

const CurrentPatientProfile = () => {
  const doctorId = 1;
  const { queue, isLoading, isError } = useFetchQueue(doctorId);
  const { updateStatusMutation } = useUpdateQueueStatus(doctorId);
  const { removePatientMutation } = useRemovePatientFromQueue();
  const [currPatient, setCurrPatient] = useState<Patient | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("info");

  const visits = usePatientRegistry(currPatient?.id)?.patientRegistryQuery.data
    ?.visits;
  const visit = visits ? visits[visits.length - 1] : null;
  const lastVisit =
    visits && visits.length > 1 ? visits[visits.length - 2] : null;

  useEffect(() => {
    if (queue && queue.length > 0) {
      setCurrPatient(queue[0].patient);
    } else {
      setCurrPatient(null);
    }
  }, [queue]);

  const handleNextPatient = async () => {
    if (!queue || queue.length === 0) return;

    const currentPatientEntry = queue[0];
    await removePatientMutation.mutateAsync({
      queueId: currentPatientEntry.id,
    });

    if (queue.length > 1) {
      const nextPatientEntry = queue[1];
      await updateStatusMutation.mutateAsync(
        { queueId: nextPatientEntry.id, status: "IN_PROGRESS" },
        {
          onSuccess: () => {
            callPatientForDoctor(nextPatientEntry.patient.fullName);
            queue.length > 2 && callNextPatient(queue[2].patient.fullName);
          },
        },
      );
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: Something went wrong...</p>;

  return (
    <div className="patient-profile-container">
      <div className="header-section">
        <h2>Current Patient Profile</h2>
      </div>

      {currPatient ? (
        <>
          {/* Reusable Header Component */}
          <PatientProfileHeader
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />

          <div className="expandable-sections">
            {expandedSection === "info" && (
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
                  <strong>Patient Notes:</strong> {currPatient.notes || "N/A"}
                </p>
              </div>
            )}
            {expandedSection === "visits" && visit && (
              <VisitCard visit={visit} currVisit={true} />
            )}
            {expandedSection === "visits" && lastVisit && (
              <VisitCard visit={lastVisit} currVisit={false} />
            )}
            {expandedSection === "medicines" && <Medicines visit={visit} />}
            {expandedSection === "files" && (
              <UserFiles patientId={currPatient.id} />
            )}
            {/* New section for printing prescriptions */}
            {expandedSection === "prescriptionPrint" && (
              <PrescriptionPrint visit={visit} />
            )}
          </div>
        </>
      ) : (
        <p>No current patient found.</p>
      )}

      {queue && queue.length > 1 && (
        <div className="next-patient-section">
          <p className="next-patient-name">
            <strong>Next Patient:</strong> {queue[1].patient.fullName}
          </p>
          <button onClick={handleNextPatient} className="next-patient-button">
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentPatientProfile;

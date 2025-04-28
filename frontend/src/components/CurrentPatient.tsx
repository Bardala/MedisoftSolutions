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
import { analyzeVisits, callNextPatient, callPatientForDoctor } from "../utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Medicines } from "./Medicines";
import PatientProfileHeader from "./PatientProfileHeader";
import { useLogin } from "../context/loginContext";
import { PrescriptionsContainer } from "./PrescriptionsContainer";
import { useIntl } from "react-intl";
import { DoctorSelect } from "./DoctorSelect";
import { useDoctorSelection } from "../hooks/useDoctors";
import DentalChart from "./DentalChart";
import { PatientInfo } from "./PatientInfo";
import { VisitTable } from "./VisitTable";

const CurrentPatientProfile = () => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();

  const { selectedDoctorId } = useDoctorSelection();

  const { queue, isLoading, isError } = useFetchQueue(selectedDoctorId);
  const { updateStatusMutation } = useUpdateQueueStatus(selectedDoctorId);
  const { removePatientMutation } = useRemovePatientFromQueue();

  const [currPatient, setCurrPatient] = useState<Patient | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("info");

  const patientRegistryData = usePatientRegistry(currPatient?.id)
    .patientRegistryQuery.data;
  const payments = patientRegistryData?.payments;
  const visits = patientRegistryData?.visits;
  const analyzedVisits =
    patientRegistryData &&
    analyzeVisits(
      patientRegistryData?.visits,
      patientRegistryData?.visitDentalProcedure,
      patientRegistryData?.visitPayments,
      patientRegistryData?.visitMedicines,
    );

  const visit = visits ? visits[visits.length - 1] : null;
  const lastVisit =
    visits && visits.length > 1 ? visits[visits.length - 2] : null;

  const analyzedVisit = analyzedVisits
    ? analyzedVisits[analyzedVisits.length - 1]
    : null;
  const lastAnalyzedVisit =
    analyzedVisits && analyzedVisits.length > 1
      ? analyzedVisits[analyzedVisits.length - 2]
      : null;

  // Save selected doctor ID to localStorage when it changes
  useEffect(() => {
    if (loggedInUser.role === "Assistant" && selectedDoctorId) {
      localStorage.setItem("selectedDoctorId", String(selectedDoctorId));
    }
  }, [selectedDoctorId, loggedInUser.role]);

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
          onSuccess: async () => {
            await Promise.resolve(
              callPatientForDoctor(nextPatientEntry.patient.fullName),
            );
            await Promise.resolve(
              queue.length > 2 && callNextPatient(queue[2].patient.fullName),
            );
          },
        },
      );
    }
  };

  if (isLoading) return <p>{f({ id: "loading" })}</p>;
  if (isError) return <p>{f({ id: "error" })}</p>;

  return (
    <div className="patient-profile-container">
      <div className="header-section">
        <h2>{f({ id: "currentPatient" })}</h2>

        {<DoctorSelect />}
      </div>

      {currPatient ? (
        <>
          <PatientProfileHeader
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />

          <div className="expandable-sections">
            {expandedSection === "info" && (
              <div className="patient-info">
                <PatientInfo
                  patient={currPatient}
                  payments={payments}
                  visits={visits}
                />
              </div>
            )}

            {/* Visits section */}
            <div className="tables">
              {expandedSection === "visits" && visit && (
                <div className="visits-section">
                  <VisitCard analyzedVisit={analyzedVisit} currVisit={true} />
                </div>
              )}

              {expandedSection === "visits" && lastVisit && (
                <>
                  <div className="visits-section">
                    <VisitCard
                      analyzedVisit={lastAnalyzedVisit}
                      currVisit={false}
                    />
                  </div>

                  {/* Rest Visits Section */}
                  <div className="expandable-sections">
                    <VisitTable patientId={currPatient?.id} showVisits="Rest" />
                  </div>
                </>
              )}
            </div>

            {expandedSection === "dentalChart" && <DentalChart />}
            {expandedSection === "medicines" && <Medicines visit={visit} />}
            {expandedSection === "files" && (
              <UserFiles patientId={currPatient?.id} />
            )}
            {expandedSection === "prescriptionPrint" && (
              <PrescriptionsContainer visit={visit} />
            )}
          </div>
        </>
      ) : (
        <p>{f({ id: "noCurrentPatient" })}</p>
      )}

      {loggedInUser.role === "Doctor" && queue?.length > 1 && (
        <div className="next-patient-section">
          <p className="next-patient-name">
            <strong>{f({ id: "nextPatient" })}:</strong>{" "}
            {queue[1].patient.fullName}
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

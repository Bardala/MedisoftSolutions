import { useState, useEffect } from "react";
import UserFiles from "./UserFiles";
import "../styles/patientProfile.css";
import { usePatientRegistry } from "../hooks/useRegistry";
import { isAssistantRole, isDoctorRole, Patient } from "../types";
import { VisitCard } from "./VisitCard";
import {
  useUpdateQueueStatus,
  useRemovePatientFromQueue,
  useFetchQueue,
} from "../hooks/useQueue";
import { callNextPatient, callPatientForDoctor, analyzeVisits } from "../utils";
import {
  faArrowRight,
  faProcedures,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
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

  const {
    queue, // the current queue entries QueueResDTO[]
    patientsInQueue, // the number of patients in the queue
    isError,
    isLoading,
    refetch: refetchQueue,
  } = useFetchQueue(selectedDoctorId);

  const { updateStatusMutation } = useUpdateQueueStatus(selectedDoctorId);
  const { removePatientMutation } = useRemovePatientFromQueue(selectedDoctorId);

  const [currPatient, setCurrPatient] = useState<Patient | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("info");

  // Get the first and second patients in queue
  const firstEntry = patientsInQueue > 0 ? queue[0] : null;
  const secEntry = patientsInQueue > 1 ? queue[1] : null;

  const { patientRegistryQuery } = usePatientRegistry(firstEntry?.patientId);

  const patientRegistryData = patientRegistryQuery.data;

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

  const analyzedVisit = analyzedVisits
    ? analyzedVisits[analyzedVisits.length - 1]
    : null;
  const lastAnalyzedVisit =
    analyzedVisits && analyzedVisits.length > 1
      ? analyzedVisits[analyzedVisits.length - 2]
      : null;

  // Save selected doctor ID to localStorage when it changes
  useEffect(() => {
    if (isAssistantRole(loggedInUser.role) && selectedDoctorId) {
      localStorage.setItem("selectedDoctorId", String(selectedDoctorId));
    }
  }, [selectedDoctorId, loggedInUser.role]);

  useEffect(() => {
    if (patientRegistryData && patientRegistryData.patient) {
      setCurrPatient(patientRegistryData.patient);
    } else {
      setCurrPatient(null);
    }
  }, [patientRegistryData]);

  const handleNextPatient = async () => {
    if (!firstEntry) return;

    await removePatientMutation.mutateAsync({
      queueId: firstEntry.id,
    });

    if (secEntry) {
      await updateStatusMutation.mutateAsync(
        { queueId: secEntry.id, status: "IN_PROGRESS" },
        {
          onSuccess: async () => {
            await Promise.all([
              callPatientForDoctor(secEntry.patientName),
              callNextPatient(secEntry.patientName),
            ]);
            refetchQueue();
          },
        },
      );
    }
  };

  if (isLoading) return <p>{f({ id: "loading" })}</p>;
  if (isError) return <p>{f({ id: "error" })}</p>;
  if (!patientsInQueue) return <p>{f({ id: "noCurrentPatient" })}</p>;

  const PatientInfoComponent = () =>
    patientRegistryData ? (
      <PatientInfo patientRegistry={patientRegistryData} />
    ) : (
      <p className="Loading">{f({ id: "loading" })}</p>
    );

  return (
    <div className="patient-profile-container">
      <div className="header-section">
        <h1>
          <FontAwesomeIcon icon={faProcedures} />{" "}
          {f({ id: "sidebar.currentPatient" })}
        </h1>

        {<DoctorSelect />}
      </div>

      {currPatient && (
        <>
          <PatientProfileHeader
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
            entry={firstEntry}
          />

          <div className="expandable-sections">
            {expandedSection === "info" && (
              <div className="patient-info">{PatientInfoComponent()}</div>
            )}

            {/* Visits section */}
            <div className="tables">
              {expandedSection === "visits" && analyzedVisit && (
                <VisitCard analyzedVisit={analyzedVisit} currVisit={true} />
              )}

              {expandedSection === "visits" && lastAnalyzedVisit && (
                <>
                  <VisitCard
                    analyzedVisit={lastAnalyzedVisit}
                    currVisit={false}
                  />

                  {/* Rest Visits Section */}
                  <VisitTable patientId={currPatient?.id} showVisits="Rest" />
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
      )}

      {isDoctorRole(loggedInUser.role) && (
        <div className="next-patient-section">
          {secEntry ? (
            <>
              <p className="next-patient-name">
                <strong>{f({ id: "nextPatient" })}:</strong>{" "}
                {secEntry.patientName}
              </p>
              <button
                onClick={handleNextPatient}
                className="next-patient-button"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
          ) : (
            <>
              <p className="next-patient-name">
                {f({ id: "noNextPatientMessage" })}
              </p>
              <button
                onClick={handleNextPatient}
                className="next-patient-button"
              >
                <FontAwesomeIcon icon={faUserCheck} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentPatientProfile;

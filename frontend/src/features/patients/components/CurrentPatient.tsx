import { useLogin } from "@/app";
import { useDoctorSelection } from "@/features/clinic-management";
import { Medicines } from "@/features/medicines";
import { UserFiles } from "@/features/patient-files/components";
import {
  usePatientRegistry,
  PatientProfileHeader,
  PatientInfo,
} from "@/features/patients";
import { PrescriptionsContainer } from "@/features/prescriptions";
import {
  useFetchQueue,
  useUpdateQueueStatus,
  useRemovePatientFromQueue,
  QueueActions,
} from "@/features/queue";
import { VisitCard, VisitTable } from "@/features/visits";
import {
  Patient,
  isAssistantRole,
  callPatientForDoctor,
  callNextPatient,
  isDoctorRole,
} from "@/shared";
import { analyzeVisits } from "@/utils";
import {
  faProcedures,
  faArrowRight,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import DentalChart from "../../charts/components/DentalChart";
import { DoctorSelect } from "@/features/clinic-management/components/DoctorSelect";
import { PatientRegistryRes } from "@/dto";
import "@styles/patientProfile.css";

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

  const patientRegistryData = patientRegistryQuery.data as PatientRegistryRes;

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
        <div className="header-content">
          <div className="header-title">
            <FontAwesomeIcon icon={faProcedures} />
            <span>{f({ id: "sidebar.currentPatient" })}</span>
          </div>

          <div className="header-controls">
            <QueueActions
              selectedDoctorId={selectedDoctorId}
              entry={firstEntry}
              compact
            />
            <DoctorSelect
            // compact
            />
          </div>
        </div>
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

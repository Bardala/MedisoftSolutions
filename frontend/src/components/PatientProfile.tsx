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
import {
  callNextPatient,
  callPatientForDoctor,
  doctorId,
  isArabic,
} from "../utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Medicines } from "./Medicines";
import PatientProfileHeader from "./PatientProfileHeader";
import { useLogin } from "../context/loginContext";
import { calculateRemainingBalance } from "../utils";
import { PrescriptionsContainer } from "./PrescriptionsContainer";
import { useUpdatePatient } from "../hooks/usePatient";
import { useIntl } from "react-intl";

const CurrentPatientProfile = () => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const { queue, isLoading, isError } = useFetchQueue(doctorId);
  const { updateStatusMutation } = useUpdateQueueStatus(doctorId);
  const { removePatientMutation } = useRemovePatientFromQueue();
  const { updatePatientMutation } = useUpdatePatient();

  const [currPatient, setCurrPatient] = useState<Patient | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("info");

  const [patientNotes, setPatientNotes] = useState("");

  const patientRegistryData = usePatientRegistry(currPatient?.id)
    .patientRegistryQuery.data;
  const payments = patientRegistryData?.payments;
  const visits = patientRegistryData?.visits;
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

  useEffect(() => {
    if (currPatient) setPatientNotes(currPatient.notes);
  }, [currPatient]);

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

  function handleSavePatientNotes(): void {
    currPatient.notes = patientNotes;
    updatePatientMutation.mutate(currPatient);
  }

  return (
    <div className="patient-profile-container">
      <div className="header-section">
        <h2>{f({ id: "currentPatient" })}</h2>
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
                  📛 <strong>{f({ id: "name" })}:</strong>{" "}
                  {currPatient.fullName}
                </p>
                <p>
                  📞 <strong>{f({ id: "phone" })}:</strong> {currPatient.phone}
                </p>
                <p>
                  🏥 <strong>{f({ id: "medicalHistory" })}:</strong>{" "}
                  {currPatient.medicalHistory || f({ id: "not_available" })}
                </p>
                <p>
                  🏠 <strong>{f({ id: "address" })}:</strong>{" "}
                  {currPatient.address || f({ id: "not_available" })}
                </p>
                <p>
                  🎂 <strong>{f({ id: "age" })}:</strong>{" "}
                  {currPatient.age || f({ id: "not_available" })}
                </p>
                {payments && (
                  <p>
                    💰 <strong>{f({ id: "totalAmountPaid" })}:</strong> $
                    {payments.reduce((acc, payment) => acc + payment.amount, 0)}
                  </p>
                )}
                <p>
                  🔴 <strong>{f({ id: "remainingBalance" })}:</strong> $
                  {calculateRemainingBalance(currPatient.notes, payments)}
                </p>
                <p>
                  📝 <strong>{f({ id: "patientNotes" })}:</strong>{" "}
                </p>
                <>
                  <textarea
                    className={isArabic(patientNotes) ? "arabic" : ""}
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    rows={4}
                    placeholder={f({ id: "addNotesPlaceholder" })}
                    disabled={loggedInUser.role === "Assistant"}
                  />
                  {loggedInUser.role === "Doctor" &&
                    patientNotes !== currPatient.notes && (
                      <div className="notes-buttons">
                        <button
                          className="save-button"
                          onClick={handleSavePatientNotes}
                        >
                          {f({ id: "saveNotes" })}
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() =>
                            setPatientNotes(currPatient?.notes || "")
                          }
                        >
                          {f({ id: "cancel" })}
                        </button>
                      </div>
                    )}
                </>
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

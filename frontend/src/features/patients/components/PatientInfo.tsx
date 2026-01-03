import { useState, useEffect, FC } from "react";
import { useIntl } from "react-intl";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "@styles/patientInfo.css";
import { PatientCharts } from ".";
import { useLogin } from "@/app";
import { PatientRegistryRes } from "@/dto";
import { useIsPatientInAnyQueue } from "@/features/queue";
import { ToggleStatsData } from "@/features/reports/components/ToggleStatsData";
import {
  calculateRemainingBalance,
  timeFormate,
  isArabic,
  isDoctorRole,
  UpdateModel,
  isNotDoctorRole,
} from "@/shared";
import { useDeletePatient, useUpdatePatient } from "../hooks";

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

interface PatientInfoProps {
  patientRegistry: PatientRegistryRes;
}

const PatientInfo: FC<PatientInfoProps> = ({ patientRegistry }) => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser: user } = useLogin();
  const { patient, visits, payments, visitDentalProcedure } = patientRegistry;
  const { deletePatientMutation } = useDeletePatient();
  const [patientNotes, setPatientNotes] = useState("");
  const {
    mutateAsync: updatePatientMutation,
    isLoading: updatePatientLoading,
    isSuccess: updatePatientSuccession,
    isError: isErrorUpdatePatient,
    error: updatePatientError,
  } = useUpdatePatient();
  const { isInQueue, isLoading: isLoadingDoctors } = useIsPatientInAnyQueue(
    patient.id,
  );

  const { totalDealsAmount: totalDeal, totalPaid: paidAmount } =
    calculateRemainingBalance(patient.notes, payments);
  const balancePercentage = totalDeal ? (paidAmount / totalDeal) * 100 : 0;

  const isLoading =
    updatePatientLoading || deletePatientMutation.isLoading || isLoadingDoctors;
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (patient) setPatientNotes(patient.notes);
  }, [patient]);

  function handleSavePatientNotes(): void {
    patient.notes = patientNotes;
    updatePatientMutation({
      newInfo: patient,
      patientId: patient.id,
    });
  }

  const handleUpdatePatient = (newInfo: typeof patient) => {
    updatePatientMutation(
      { newInfo, patientId: patient.id },
      {
        onError: (err) => {
          alert(f({ id: "error_updating_patient" }, { error: err.message }));
        },
      },
    );
  };

  const handleDeletePatient = () => {
    if (patient.id) {
      deletePatientMutation.mutate(patient.id, {
        onSuccess: () => {
          alert(f({ id: "patient_deleted_success" }));
          window.location.reload();
        },
        onError: (err) => {
          alert(f({ id: "error_deleting_patient" }, { error: err.message }));
        },
      });
    }
  };

  // Age phase visualization data
  const agePhases = [
    { name: "Child", range: [0, 12], emoji: "👶", color: "#FFD166" },
    { name: "Teen", range: [13, 19], emoji: "🧒", color: "#06D6A0" },
    { name: "Adult", range: [20, 39], emoji: "🧑", color: "#118AB2" },
    { name: "Middle", range: [40, 59], emoji: "🧔", color: "#073B4C" },
    { name: "Senior", range: [60, 100], emoji: "🧓", color: "#EF476F" },
  ];

  const currentPhase =
    agePhases.find(
      (phase) => patient.age >= phase.range[0] && patient.age <= phase.range[1],
    ) || agePhases[0];

  return (
    <>
      <div className="printable-patient-info" style={{ content: "center" }}>
        <p style={{ content: "center" }}>
          <strong>{f({ id: "patient_name" })}: </strong>
          {patient.fullName}
        </p>
        {isNotDoctorRole(user.role) && (
          <p>
            <strong>{f({ id: "phonePlaceholder" })}: </strong>
            {patient.phone}
          </p>
        )}
        {patient.medicalHistory && (
          <p>
            <strong>Medical History: </strong> {patient.medicalHistory || "N/A"}
          </p>
        )}
        {isNotDoctorRole(user.role) && (
          <p>
            <strong>{f({ id: "total_amount_paid" })}: </strong>
            {paidAmount || 0} {f({ id: "L.E" })}
          </p>
        )}
        {isNotDoctorRole(user.role) && patient.address && (
          <p>
            <strong>{f({ id: "patient_address" })}: </strong>
            {patient.address}
          </p>
        )}
        {patient.notes && (
          <p>
            <strong>{f({ id: "patient_notes" })} </strong>
            <br />
            {patient.notes}
          </p>
        )}
      </div>

      <div className="patient-info-wrapper">
        <ToggleStatsData
          header={f({ id: "patient_details" }, { fullName: patient.fullName })}
          setShowStats={setShowStats}
          showStats={showStats}
          dataIcon={faUser}
        />

        {showStats ? (
          <PatientCharts
            payments={payments}
            visits={visits}
            visitDentalProcedures={visitDentalProcedure}
          />
        ) : (
          <div className="patient-info-container">
            {/* Header Section */}
            <div className="patient-header-section">
              <div className="patient-header">
                <h2 className="patient-id">
                  {f({ id: "patient_id" }, { id: patient.id })}
                </h2>
                {isNotDoctorRole(user.role) && (
                  <a
                    href={`tel:${patient.phone}`}
                    className="patient-phone-chip"
                    onClick={(e) => {
                      // Prevent default if you need to handle it differently on web
                      if (!/Mobi|Android/i.test(navigator.userAgent)) {
                        e.preventDefault();
                        alert(
                          f(
                            { id: "call_phone_on_mobile" },
                            { phone: patient.phone },
                          ),
                        );
                      }
                    }}
                    aria-label={f(
                      { id: "call_patient" },
                      { phone: patient.phone },
                    )}
                  >
                    {f({ id: "patient_phone" }, { phone: patient.phone })}
                  </a>
                )}
              </div>

              {/* Visualizations Row */}
              {isNotDoctorRole(user.role) && (
                <div className="visualizations-row">
                  {/* Balance Visualization */}
                  <div className="visualization-card balance-visualization">
                    {totalDeal ? (
                      <>
                        <h3 className="visualization-title">
                          {f(
                            { id: "remaining_balance" },
                            { balance: totalDeal - paidAmount || 0 },
                          )}
                        </h3>
                        <div className="battery-container">
                          <div className="battery">
                            <div
                              className="battery-level"
                              style={{
                                width: `${balancePercentage}%`,
                                backgroundColor:
                                  balancePercentage > 70
                                    ? "#4CAF50"
                                    : balancePercentage > 30
                                    ? "#FFC107"
                                    : "#F44336",
                              }}
                            ></div>
                          </div>
                          <div className="battery-cap"></div>
                          <span className="balance-text">
                            {paidAmount || 0} {f({ id: "L.E" })} /{" "}
                            {totalDeal || 0} {f({ id: "L.E" })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="card-icon">💰</div>
                        <h4 className="card-title">
                          {f({ id: "total_amount_paid" })}
                        </h4>
                        <p className="card-content">
                          {paidAmount || 0} {f({ id: "L.E" })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Info Cards Grid */}
              <div className="info-grid">
                {patient.age && (
                  <div className="info-card age-card">
                    <div className="card-icon">{currentPhase.emoji}</div>
                    <h4 className="card-title">{f({ id: "patient_age" })}</h4>
                    <p className="card-content">
                      {patient.age} —{" "}
                      {f({
                        id: `age_phase_${currentPhase.name.toLowerCase()}`,
                      })}
                    </p>
                  </div>
                )}

                {/* Visits Count Card */}
                <div className="info-card visits-card">
                  <div className="card-icon">📅</div>
                  <h4 className="card-title">{f({ id: "total_visits" })}</h4>
                  <p className="card-content">{visits?.length || 0}</p>
                </div>
                {isNotDoctorRole(user.role) && (
                  <div className="info-card address-card">
                    <div className="card-icon">📍</div>
                    <h4 className="card-title">
                      {f({ id: "patient_address" })}
                    </h4>
                    <p className="card-content">
                      {patient.address || f({ id: "not_available" })}
                    </p>
                  </div>
                )}
                <div className="info-card medical-card">
                  <div className="card-icon">💊</div>
                  <h4 className="card-title">
                    {f({ id: "patient_medical_history" })}
                  </h4>
                  <p className="card-content">
                    {patient.medicalHistory || f({ id: "not_available" })}
                  </p>
                </div>
                <div className="info-card registration-card">
                  <div className="card-icon">📅</div>
                  <h4 className="card-title">
                    {f({ id: "patient_registered_on" })}
                  </h4>
                  <p className="card-content">
                    {timeFormate(patient.createdAt) ||
                      f({ id: "not_available" })}
                  </p>
                </div>
              </div>

              {/* Notes Section */}
              <div className="notes-section">
                <h4 className="section-title">{f({ id: "patient_notes" })}</h4>
                <textarea
                  className={`notes-textarea ${
                    isArabic(patientNotes) ? "arabic" : ""
                  }`}
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  rows={4}
                  placeholder={f({ id: "notes" })}
                  disabled={user.role === "Assistant"}
                />
                {isDoctorRole(user.role) && patientNotes !== patient.notes && (
                  <div className="notes-buttons">
                    <button
                      className="save-button"
                      onClick={handleSavePatientNotes}
                      disabled={isLoading}
                    >
                      {f({ id: "save_notes" })}
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setPatientNotes(patient?.notes || "")}
                      disabled={isLoading}
                    >
                      {f({ id: "cancel" })}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Messages */}
            {updatePatientSuccession && (
              <div className="status-message success">
                {f({ id: "patient_updated_success" })}
              </div>
            )}
            {isErrorUpdatePatient && (
              <div className="status-message error">
                {f({ id: "error_updating_patient" })}{" "}
                {updatePatientError.message}
              </div>
            )}

            {isLoading && (
              <div className="status-message loading">
                {f({ id: "loading" })}
              </div>
            )}

            {/* Update/Delete Controls */}
            <UpdateModel
              objectToEdit={patient}
              handelUpdate={isLoading ? undefined : handleUpdatePatient}
              handelDelete={
                isLoading
                  ? undefined
                  : isInQueue
                  ? undefined
                  : handleDeletePatient
              }
              title={f({ id: "update_patient_details" })}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PatientInfo;

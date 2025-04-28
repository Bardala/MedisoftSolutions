import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useLogin } from "../context/loginContext";
import { useDeletePatient, useUpdatePatient } from "../hooks/usePatient";
import { Patient, Visit, Payment } from "../types";
import { timeFormate, calculateRemainingBalance, isArabic } from "../utils";
import { FormModal } from "./FormModel";

export const PatientInfo = ({
  patient,
  visits,
  payments,
}: {
  patient: Patient;
  visits: Visit[];
  payments: Payment[];
}) => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deletePatientMutation } = useDeletePatient();
  const [patientNotes, setPatientNotes] = useState("");
  const { updatePatientMutation } = useUpdatePatient();

  useEffect(() => {
    if (patient) setPatientNotes(patient.notes);
  }, [patient]);

  function handleSavePatientNotes(): void {
    patient.notes = patientNotes;
    updatePatientMutation.mutate(patient);
  }
  const handleUpdatePatient = (updatedPatient: typeof patient) => {
    updatePatientMutation.mutate(updatedPatient, {
      onSuccess: () => {
        alert(f({ id: "patient_updated_success" }));
        setUpdateModalOpen(false);
      },
      onError: (err) => {
        alert(f({ id: "error_updating_patient" }, { error: err.message }));
      },
    });
  };

  const handleDeletePatient = () => {
    if (patient.id) {
      deletePatientMutation.mutate(patient.id, {
        onSuccess: () => {
          alert(f({ id: "patient_deleted_success" }));
          setConfirmDelete(false);
        },
        onError: (err) => {
          alert(f({ id: "error_deleting_patient" }, { error: err.message }));
        },
      });
    }
  };

  return (
    <div>
      {/* Patient Details */}
      <h2>{f({ id: "patient_details" }, { fullName: patient.fullName })}</h2>
      <p>{f({ id: "patient_id" }, { id: patient.id })}</p>
      <p className="mt-2">
        {f({ id: "patient_phone" }, { phone: patient.phone })}
      </p>
      <p>
        {f(
          { id: "patient_age" },
          { age: patient.age || f({ id: "not_available" }) },
        )}
      </p>
      <p>
        {f(
          { id: "patient_address" },
          { address: patient.address || f({ id: "not_available" }) },
        )}
      </p>
      <p>
        {f(
          { id: "patient_medical_history" },
          {
            medicalHistory:
              patient.medicalHistory || f({ id: "not_available" }),
          },
        )}
      </p>
      {visits && (
        <p>{f({ id: "patient_visits" }, { visits: visits.length })}</p>
      )}
      <p>
        {f(
          { id: "patient_registered_on" },
          {
            registeredOn:
              timeFormate(patient.createdAt) || f({ id: "not_available" }),
          },
        )}
      </p>
      {payments && (
        <p>
          {f(
            { id: "total_amount_paid" },
            {
              amount: payments.reduce(
                (acc, payment) => acc + payment.amount,
                0,
              ),
            },
          )}
        </p>
      )}
      <p>
        {f(
          { id: "remaining_balance" },
          {
            balance: calculateRemainingBalance(patient.notes, payments),
          },
        )}
      </p>
      <p>{f({ id: "patient_notes" })}</p>
      <>
        <textarea
          className={isArabic(patientNotes) ? "arabic" : ""}
          value={patientNotes}
          onChange={(e) => setPatientNotes(e.target.value)}
          rows={4}
          placeholder={f({ id: "notes" })}
          disabled={loggedInUser.role === "Assistant"}
        />
        {loggedInUser.role === "Doctor" && patientNotes !== patient.notes && (
          <div className="notes-buttons">
            <button className="save-button" onClick={handleSavePatientNotes}>
              {f({ id: "save_notes" })}
            </button>
            <button
              className="cancel-button"
              onClick={() => setPatientNotes(patient?.notes || "")}
            >
              {f({ id: "cancel" })}
            </button>
          </div>
        )}
      </>

      {/* Action buttons */}
      {loggedInUser.role === "Doctor" && (
        <div className="edit-patient">
          <button onClick={() => setUpdateModalOpen(!isUpdateModalOpen)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={() => setConfirmDelete(true)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && patient && (
        <div>
          <FormModal
            objectToEdit={patient}
            onSave={handleUpdatePatient}
            onClose={() => setUpdateModalOpen(false)}
            title={f({ id: "update_patient_details" })}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div>
          <div>
            <h2>{f({ id: "confirm_delete" })}</h2>
            <p>{f({ id: "delete_confirmation_message" })}</p>
            <div>
              <button onClick={() => setConfirmDelete(false)}>
                {f({ id: "cancel" })}
              </button>
              <button onClick={handleDeletePatient}>
                {f({ id: "delete" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

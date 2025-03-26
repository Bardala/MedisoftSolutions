import { FC, useEffect, useState } from "react";
import PatientSearch from "./PatientSearch";
import { usePatientSearch } from "../hooks/usePatientSearch";
import { usePatientRegistry } from "../hooks/useRegistry";
import { analyzeVisits, findUnlinkedPayments } from "../utils/visitAnalysis";
import Table from "./Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faExchangeAlt,
  faSearch,
  faTrash,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  monthlyTimeFormate,
  timeFormate,
  yearlyTimeFormate,
} from "../utils/timeFormat";
import "../styles/getRegistry.css";
import UserFiles from "./UserFiles";
import { useDeletePatient, useUpdatePatient } from "../hooks/usePatient";
import { FormModal } from "./FormModel";
import { DentalProcedure, Payment, Visit } from "../types";
import { sortById } from "../utils/sort";
import { calculateRemainingBalance, isArabic, speak } from "../utils";
import { useLogin } from "../context/loginContext";
import { useIntl } from "react-intl";

export const GetRegistry: FC = () => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const { handlePatientSelect, selectedPatient, allPatients } =
    usePatientSearch();
  const [patientId, setPatientId] = useState<number | null>(null);
  const { patientRegistryQuery } = usePatientRegistry(patientId);
  const { data, isLoading, error } = patientRegistryQuery;

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [convertPaymentTable, setConvertPaymentTable] = useState(false);

  const [patientNotes, setPatientNotes] = useState("");
  useEffect(() => {
    if (data?.patient) setPatientNotes(data?.patient.notes);
  }, [data?.patient]);

  const { updatePatientMutation } = useUpdatePatient();
  const { deletePatientMutation } = useDeletePatient();

  const handleSubmit = () =>
    selectedPatient && setPatientId(selectedPatient.id);

  const handleUpdatePatient = (updatedPatient: typeof data.patient) => {
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
    if (patientId) {
      deletePatientMutation.mutate(patientId, {
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

  const allPatientColumns = [
    {
      header: f({ id: "patient_id" }),
      accessor: (row) => row.id,
    },
    {
      header: f({ id: "full_name" }),
      accessor: (row) => row.fullName,
    },
    {
      header: f({ id: "address" }),
      accessor: (row) => row.address || f({ id: "not_available" }),
    },
    {
      header: f({ id: "age" }),
      accessor: (row) => row.age || f({ id: "not_available" }),
    },
    {
      header: f({ id: "phone_number" }),
      accessor: (row) => row.phone,
      expandable: true,
    },
    {
      header: f({ id: "registered_at" }),
      accessor: (row) => timeFormate(row.createdAt),
      expandable: true,
    },
    {
      header: f({ id: "medical_history" }),
      accessor: (row) => row.medicalHistory || f({ id: "not_available" }),
      expandable: true,
    },
  ];

  const visitColumns = [
    {
      header: f({ id: "visit_id" }),
      accessor: (row: { visit: Visit }) => row.visit.id,
    },
    {
      header: f({ id: "payment" }),
      accessor: (row: { payment: Payment }) =>
        row.payment ? `$${row.payment.amount}` : f({ id: "not_available" }),
    },
    {
      header: f({ id: "date" }),
      accessor: (row: { visit: Visit }) =>
        monthlyTimeFormate(row.visit.createdAt),
    },
    {
      header: f({ id: "notes" }),
      accessor: (row: { visit: Visit }) =>
        row.visit.doctorNotes || f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "procedures" }),
      accessor: (row: { procedures: DentalProcedure[] }) =>
        row.procedures
          ?.map(
            (procedure: DentalProcedure) =>
              procedure.serviceName + " " + procedure.arabicName,
          )
          .join(", ") || f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "medicines" }),
      accessor: (row) =>
        row.medicines?.map((medicine) => medicine.medicineName).join(", ") ||
        f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "year" }),
      accessor: (row: { visit: Visit }) =>
        yearlyTimeFormate(row.visit.createdAt),
      expandable: true,
    },
  ];

  const paymentColumns = [
    {
      header: f({ id: "payment_id" }),
      accessor: (row) => row?.id,
    },
    {
      header: f({ id: "amount" }),
      accessor: (row) => `$${row?.amount}`,
    },
    {
      header: f({ id: "date" }),
      accessor: (row) => monthlyTimeFormate(row.createdAt),
    },
    {
      header: f({ id: "recorded_by" }),
      accessor: (row) => row.recordedBy.name,
      expandable: true,
    },
    {
      header: f({ id: "year" }),
      accessor: (row) => yearlyTimeFormate(row.createdAt),
      expandable: true,
    },
  ];

  function handleSavePatientNotes(): void {
    data.patient.notes = patientNotes;
    updatePatientMutation.mutate(data.patient);
  }

  return (
    <div className="container">
      <h1>{f({ id: "patient_registry" })}</h1>
      <PatientSearch onSelect={handlePatientSelect} />
      <button
        className="search-button"
        onClick={handleSubmit}
        disabled={!selectedPatient}
      >
        <FontAwesomeIcon icon={faSearch} /> {selectedPatient?.fullName}
      </button>

      {!!patientId && isLoading && (
        <p>{f({ id: "loading_patient_registry" })}</p>
      )}
      {error && (
        <p>
          {f(
            { id: "error_loading_patient_registry" },
            { error: error.message },
          )}
        </p>
      )}

      {data && (
        <div>
          {/* Patient Details */}
          <h2>
            {f({ id: "patient_details" }, { fullName: data.patient.fullName })}
          </h2>
          <p>{f({ id: "patient_id" }, { id: data.patient.id })}</p>
          <p className="mt-2">
            {f({ id: "patient_phone" }, { phone: data.patient.phone })}
          </p>
          <p>
            {f(
              { id: "patient_age" },
              { age: data.patient.age || f({ id: "not_available" }) },
            )}
          </p>
          <p>
            {f(
              { id: "patient_address" },
              { address: data.patient.address || f({ id: "not_available" }) },
            )}
          </p>
          <p>
            {f(
              { id: "patient_medical_history" },
              {
                medicalHistory:
                  data.patient.medicalHistory || f({ id: "not_available" }),
              },
            )}
          </p>
          {data.visits && (
            <p>{f({ id: "patient_visits" }, { visits: data.visits.length })}</p>
          )}
          <p>
            {f(
              { id: "patient_registered_on" },
              {
                registeredOn:
                  timeFormate(data.patient.createdAt) ||
                  f({ id: "not_available" }),
              },
            )}
          </p>
          {data.payments && (
            <p>
              {f(
                { id: "total_amount_paid" },
                {
                  amount: data.payments.reduce(
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
                balance: calculateRemainingBalance(
                  data.patient.notes,
                  data.payments,
                ),
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
            {loggedInUser.role === "Doctor" &&
              patientNotes !== data.patient.notes && (
                <div className="notes-buttons">
                  <button
                    className="save-button"
                    onClick={handleSavePatientNotes}
                  >
                    {f({ id: "save_notes" })}
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setPatientNotes(data.patient?.notes || "")}
                  >
                    {f({ id: "cancel" })}
                  </button>
                </div>
              )}
          </>

          {/* Action buttons */}
          {loggedInUser.role === "Doctor" && (
            <div>
              <button onClick={() => setUpdateModalOpen(!isUpdateModalOpen)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => setConfirmDelete(true)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="action-button speak-button"
                onClick={() => speak(data.patient.fullName, "ar")}
                title={f({ id: "speak_name" })}
              >
                <FontAwesomeIcon icon={faVolumeUp} />
              </button>
            </div>
          )}

          {/* Update Modal */}
          {isUpdateModalOpen && data?.patient && (
            <FormModal
              objectToEdit={data.patient}
              onSave={handleUpdatePatient}
              onClose={() => setUpdateModalOpen(false)}
              title={f({ id: "update_patient_details" })}
            />
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

          {/* Visits Section */}
          <h3>{f({ id: "visits" })}</h3>
          <Table
            columns={visitColumns}
            data={analyzeVisits(
              sortById(data.visits),
              data.visitDentalProcedure,
              data.visitPayments,
              data.visitMedicines,
            )}
            enableActions={true}
          />

          {/* Unlinked Payments Section */}
          <div>
            {/* Header for Table */}
            <div className="payment-header-container">
              <h4 className="payment-header">
                {convertPaymentTable
                  ? f({ id: "all_payments" })
                  : f({ id: "unlinked_payments" })}
              </h4>
              <button
                onClick={() => setConvertPaymentTable(!convertPaymentTable)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faExchangeAlt} />
              </button>
            </div>

            {/* Toggle Between Tables */}
            {convertPaymentTable ? (
              <Table
                columns={paymentColumns}
                data={sortById(data.payments)}
                enableActions={true}
              />
            ) : (
              <Table
                columns={paymentColumns}
                data={findUnlinkedPayments(
                  sortById(data.payments),
                  data.visitPayments,
                )}
                enableActions={true}
              />
            )}
          </div>

          <UserFiles patientId={patientId} />
        </div>
      )}

      {!selectedPatient && allPatients?.length > 0 && (
        <Table
          columns={allPatientColumns}
          data={allPatients.sort(
            (p1, p2) => p1.fullName.charCodeAt(0) - p2.fullName.charCodeAt(0),
          )}
          enableActions={true}
          onUpdate={
            loggedInUser.role === "Doctor"
              ? updatePatientMutation.mutate
              : undefined
          }
        />
      )}
    </div>
  );
};

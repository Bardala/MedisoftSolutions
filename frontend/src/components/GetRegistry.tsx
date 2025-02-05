/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
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
import { useUpdatePayment, useDeletePayment } from "../hooks/usePayment";
import { useUpdateVisit, useDeleteVisit } from "../hooks/useVisit";
import { sortById } from "../utils/sort";
import { handleSpeakName } from "../utils";

export const GetRegistry: FC = () => {
  const { handlePatientSelect, selectedPatient, allPatients } =
    usePatientSearch();
  const [patientId, setPatientId] = useState<number | null>(null);
  const { patientRegistryQuery } = usePatientRegistry(patientId);
  const { data, isLoading, error } = patientRegistryQuery;

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [convertPaymentTable, setConvertPaymentTable] = useState(false);

  const { updatePatientMutation } = useUpdatePatient();
  const { deletePatientMutation } = useDeletePatient();

  const { updateVisitMutation } = useUpdateVisit();
  const { deleteVisitMutation } = useDeleteVisit();

  const { updatePaymentMutation } = useUpdatePayment();
  const { deletePaymentMutation } = useDeletePayment();

  const handleSubmit = () =>
    selectedPatient && setPatientId(selectedPatient.id);

  const handleUpdatePatient = (updatedPatient: typeof data.patient) => {
    updatePatientMutation.mutate(updatedPatient, {
      onSuccess: () => {
        alert("Patient updated successfully!");
        setUpdateModalOpen(false);
      },
      onError: (err) => {
        alert(`Error updating patient: ${err.message}`);
      },
    });
  };

  const handleDeletePatient = () => {
    if (patientId) {
      deletePatientMutation.mutate(patientId, {
        onSuccess: () => {
          alert("Patient deleted successfully!");
          setConfirmDelete(false);
        },
        onError: (err) => {
          alert(`Error deleting patient: ${err.message}`);
        },
      });
    }
  };

  const allPatientColumns = [
    {
      header: "Id",
      accessor: (row) => row.id,
    },
    {
      header: "Fullname",
      accessor: (row) => row.fullName,
    },
    {
      header: "Address",
      accessor: (row) => row.address || "N/A",
    },
    {
      header: "Age",
      accessor: (row) => row.age || "N/A",
    },
    {
      header: "Phone Number",
      accessor: (row) => row.phone,
      expandable: true,
    },
    {
      header: "Notes",
      accessor: (row) => row.notes || "N/A",
      expandable: true,
    },
    {
      header: "Registered At",
      accessor: (row) => timeFormate(row.createdAt),
      expandable: true,
    },
    {
      header: "Medical History",
      accessor: (row) => row.medicalHistory || "N/A",
      expandable: true,
    },
  ];

  const visitColumns = [
    {
      header: "Visit Id",
      accessor: (row: { visit: Visit }) => row.visit.id,
    },
    {
      header: "Payment",
      accessor: (row: { payment: Payment }) =>
        row.payment ? `$${row.payment.amount}` : "N/A",
    },
    {
      header: "Date",
      accessor: (row: { visit: Visit }) =>
        monthlyTimeFormate(row.visit.createdAt),
    },
    {
      header: "Notes",
      accessor: (row: { visit: Visit }) => row.visit.doctorNotes || "N/A",
      expandable: true,
    },
    {
      header: "Procedures",
      accessor: (row: { procedures: DentalProcedure[] }) =>
        row.procedures
          ?.map(
            (procedure: DentalProcedure) =>
              procedure.serviceName + " " + procedure.arabicName,
          )
          .join(", ") || "N/A",
      expandable: true,
    },
    {
      header: "Medicines",
      accessor: (row: any) =>
        row.medicines?.map((medicine) => medicine.medicineName).join(", ") ||
        "N/A",
      expandable: true,
    },
    {
      header: "Year",
      accessor: (row: { visit: Visit }) =>
        yearlyTimeFormate(row.visit.createdAt),
      expandable: true,
    },
  ];

  const paymentColumns = [
    {
      header: "Payment Id",
      accessor: (row: any) => row?.id,
    },
    {
      header: "Amount",
      accessor: (row: any) => `$${row?.amount}`,
    },
    {
      header: "Date",
      accessor: (row: any) => monthlyTimeFormate(row.createdAt),
    },
    {
      header: "Recorded By",
      accessor: (row: any) => row.recordedBy.name,
      expandable: true,
    },
    {
      header: "Year",
      accessor: (row: any) => yearlyTimeFormate(row.createdAt),
      expandable: true,
    },
  ];

  return (
    <div className="container">
      <h1>Patient Registry</h1>
      <PatientSearch onSelect={handlePatientSelect} />
      <button
        className="search-button"
        onClick={handleSubmit}
        disabled={!selectedPatient}
      >
        <FontAwesomeIcon icon={faSearch} /> {selectedPatient?.fullName}
      </button>

      {!!patientId && isLoading && <p>Loading patient registry...</p>}
      {error && <p>Error loading patient registry: {error.message}</p>}

      {data && (
        <div>
          {/*patient details */}
          <h2>{data.patient.fullName}</h2>
          <p>
            <strong>Id:</strong> {data.patient.id}
          </p>
          <p className="mt-2">
            <strong>Phone:</strong> {data.patient.phone}
          </p>
          <p>
            <strong>Age:</strong> {data.patient.age || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {data.patient.address || "N/A"}
          </p>
          <p>
            <strong>Medical History:</strong>{" "}
            {data.patient.medicalHistory || "N/A"}
          </p>
          {data.payments && (
            <p>
              <strong>Amount Paid: </strong>
              {"$"}
              {data.payments.reduce((acc, payment) => acc + payment.amount, 0)}
            </p>
          )}
          {data.visits && (
            <p>
              <strong>Number of Visit:</strong> {data.visits.length}
            </p>
          )}
          <p>
            <strong>Notes:</strong> {data.patient.notes || "N/A"}
          </p>
          <p>
            <strong>Registered On:</strong>{" "}
            {timeFormate(data.patient.createdAt) || "N/A"}
          </p>

          {/* Action buttons */}
          <div>
            <button onClick={() => setUpdateModalOpen(true)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => setConfirmDelete(true)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              className="action-button speak-button"
              onClick={() =>
                handleSpeakName(data.patient.fullName, 1, "IN_PROGRESS")
              }
              title="Speak Name"
            >
              <FontAwesomeIcon icon={faVolumeUp} />
            </button>
          </div>

          {/* Update Modal */}
          {isUpdateModalOpen && data?.patient && (
            <FormModal
              objectToEdit={data.patient}
              onSave={handleUpdatePatient}
              onClose={() => setUpdateModalOpen(false)}
              title="Update Patient Details"
            />
          )}

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div>
              <div>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this patient?</p>
                <div>
                  <button onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                  <button onClick={handleDeletePatient}>Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Visits Section */}
          <h3>Visits</h3>
          <Table
            columns={visitColumns}
            data={analyzeVisits(
              sortById(data.visits),
              data.visitDentalProcedure,
              data.visitPayments,
              data.visitMedicines,
            )}
            // onUpdate={updateVisitMutation.mutate}
            // onDelete={deleteVisitMutation.mutate}
            enableActions={true}
          />

          {/* Unlinked Payments Section */}
          {/* <h3 className="text-lg font-semibold mt-6">Unlinked Payments</h3> */}
          <div>
            {/* Header for Table */}
            <div className="payment-header-container">
              <h4 className="payment-header">
                {convertPaymentTable ? "All Payments" : "Unlinked Payments"}
              </h4>
              <button
                onClick={() => setConvertPaymentTable(!convertPaymentTable)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                <FontAwesomeIcon icon={faExchangeAlt} />
                {/* <span>
                  {convertPaymentTable
                    ? " View Unlinked Payments"
                    : " View All Payments"}
                </span> */}
              </button>
            </div>

            {/* Toggle Between Tables */}
            {convertPaymentTable ? (
              <Table
                columns={paymentColumns}
                data={sortById(data.payments)}
                // onUpdate={updatePaymentMutation.mutate}
                // onDelete={deletePaymentMutation.mutate}
                enableActions={true}
              />
            ) : (
              <Table
                columns={paymentColumns}
                data={findUnlinkedPayments(
                  sortById(data.payments),
                  data.visitPayments,
                )}
                // onUpdate={updatePaymentMutation.mutate}
                // onDelete={deletePaymentMutation.mutate}
                enableActions={true}
              />
            )}
          </div>

          <UserFiles patientId={patientId} />

          {/* <UploadImage patientId={selectedPatient.id + ""} /> */}
        </div>
      )}

      {!selectedPatient && allPatients?.length > 0 && (
        <Table
          columns={allPatientColumns}
          data={allPatients}
          enableActions={true}
          onUpdate={updatePatientMutation.mutate}
        />
      )}
    </div>
  );
};

import React, { FC, useState } from "react";
import PatientSearch from "./PatientSearch";
import { usePatientSearch } from "../hooks/usePatientSearch";
import { usePatientRegistry } from "../hooks/useRegistry";
import { analyzeVisits, findUnlinkedPayments } from "../utils/visitAnalysis";
import Table from "./Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { timeFormate } from "../utils/timeFormat";
import "../styles/getRegistry.css";
import UploadImage from "./UploadImage";
import UserFiles from "./UserFiles";

export const GetRegistry: FC = () => {
  const { handlePatientSelect, selectedPatient } = usePatientSearch();
  const { mutation: patientRegistry } = usePatientRegistry();
  const [patientId, setPatientId] = useState<number | null>(null);
  const { data, isLoading, error } = patientRegistry;

  const handleSubmit = () => {
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
      patientRegistry.mutate(selectedPatient.id);
    }
  };

  const visitColumns = [
    { header: "Date", accessor: (row: any) => timeFormate(row.createdAt) },
    { header: "Notes", accessor: "doctorNotes" },
    {
      header: "Procedures",
      accessor: (row: any) => row.procedures?.join(", ") || "N/A",
    },
    { header: "Total Payment", accessor: (row: any) => `$${row.totalPayment}` },
    {
      header: "Medicines",
      accessor: (row: any) => row.medicines?.join(", ") || "N/A",
    },
  ];

  const paymentColumns = [
    { header: "Payment ID", accessor: "id" },
    { header: "Amount", accessor: (row: any) => `$${row.amount}` },
    { header: "Date", accessor: (row: any) => timeFormate(row.createdAt) },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Registry</h1>
      <PatientSearch onSelect={handlePatientSelect} />
      <button
        onClick={handleSubmit}
        disabled={!selectedPatient}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>

      {isLoading && (
        <p className="text-blue-500 mt-4">Loading patient registry...</p>
      )}
      {error && (
        <p className="text-red-500 mt-4">
          Error loading patient registry: {error.message}
        </p>
      )}

      {data && (
        <div className="mt-8 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold">{data.patient.fullName}</h2>
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
          <p>
            <strong>Notes:</strong> {data.patient.notes || "N/A"}
          </p>
          <p>
            <strong>Registered On:</strong>{" "}
            {timeFormate(data.patient.createdAt) || "N/A"}
          </p>

          {/* Visits Section */}
          <h3 className="text-lg font-semibold mt-6">Visits</h3>
          <Table
            columns={visitColumns}
            data={analyzeVisits(
              data.visits,
              data.visitDentalProcedure,
              data.visitPayments,
              data.visitMedicines,
            )}
          />

          {/* Unlinked Payments Section */}
          <h3 className="text-lg font-semibold mt-6">Unlinked Payments</h3>
          <Table
            columns={paymentColumns}
            data={findUnlinkedPayments(data.payments, data.visitPayments)}
          />

          <UserFiles patientId={patientId} />

          <UploadImage patientId={selectedPatient.id + ""} />
        </div>
      )}
    </div>
  );
};

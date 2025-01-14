import React, { FC, useState } from "react";
import PatientSearch from "./PatientSearch";
import { usePatientSearch } from "../hooks/usePatientSearch";
import { usePatientRegistry } from "../hooks/useRegistry";
import { analyzeVisits, findUnlinkedPayments } from "../utils/visitAnalysis";
import "../styles/getRegistry.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GetRegistry: FC = () => {
  const { handlePatientSelect, selectedPatient } = usePatientSearch();
  const { mutation: patientRegistry } = usePatientRegistry();
  const [, setPatientId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
      patientRegistry.mutate(selectedPatient.id);
    }
  };

  const { data, isLoading, error } = patientRegistry;

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
            {data.patient.createdAt
              ? new Date(data.patient.createdAt).toLocaleDateString()
              : "N/A"}
          </p>

          {/* Visits Section */}
          <h3 className="text-lg font-semibold mt-6">Visits</h3>
          <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Date</th>
                <th className="border border-gray-200 px-4 py-2">Doctor</th>
                <th className="border border-gray-200 px-4 py-2">Notes</th>
                <th className="border border-gray-200 px-4 py-2">Procedures</th>
                <th className="border border-gray-200 px-4 py-2">
                  Total Payment
                </th>
                <th className="border border-gray-200 px-4 py-2">Medicines</th>
              </tr>
            </thead>
            <tbody>
              {analyzeVisits(
                data.visits,
                data.visitDentalProcedure,
                data.visitPayments,
                data.visitMedicines,
              ).map((visit) => (
                <tr key={visit.id}>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.visitDate
                      ? new Date(visit.visitDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.doctorName}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.doctorNotes}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.procedures?.join(", ") || "N/A"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    ${visit.totalPayment}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {visit.medicines?.join(", ") || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Unlinked Payments Section */}
          <h3 className="text-lg font-semibold mt-6">Unlinked Payments</h3>
          <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Payment ID</th>
                <th className="border border-gray-200 px-4 py-2">Amount</th>
                <th className="border border-gray-200 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {findUnlinkedPayments(data.payments, data.visitPayments).map(
                (payment) => (
                  <tr key={payment.id}>
                    <td className="border border-gray-200 px-4 py-2">
                      {payment.id}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      ${payment.amount}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {new Date(payment?.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import React from "react";
import { useAddVisit } from "../hooks/useVisit";
import PatientSearch from "./PatientSearch";
import DentalProcedureSearch from "./DentalProcedureSearch";
import "../styles/addVisit.css";

export const AddVisit: React.FC = () => {
  const {
    setDoctorNotes,
    setPaymentAmount,
    handleDentalProcedureSelect,
    handlePatientSelect,
    selectedDentalProcedures,
    selectedPatient,
    paymentAmount,
    handleSubmit,
    doctorNotes,
    successMessage,
    createdVisitDetails,
    createdPaymentDetails,
  } = useAddVisit();

  return (
    <div className="add-visit-container">
      <h2>📋Record Visit</h2>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
          {createdVisitDetails && (
            <div>
              <h3>Visit Details:</h3>
              <p>Visit ID: {createdVisitDetails.visitId}</p>
              <p>Patient: {createdVisitDetails.patientName}</p>
              <p>Doctor: {createdVisitDetails.doctorName}</p>
              Dental Procedures:{" "}
              {createdVisitDetails.procedures?.map((p, index) => (
                <p key={index}>
                  {p.arabicName}, {p.serviceName}
                </p>
              ))}
              <p>Visit Date: {createdVisitDetails.visitDate}</p>
              <p>Doctor Notes: {createdVisitDetails.doctorNotes}</p>
            </div>
          )}
          {createdPaymentDetails && (
            <div>
              <h3>Payment Details:</h3>
              <p>Payment ID: {createdPaymentDetails.paymentId}</p>
              <p>Amount: ${createdPaymentDetails.amount}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Patient Selection */}
        <PatientSearch onSelect={handlePatientSelect} />
        {selectedPatient && (
          <div className="selected-items">
            Selected Patient: {selectedPatient.fullName} (
            {selectedPatient.phone})
          </div>
        )}

        {/* Dental Procedure Selection */}
        <DentalProcedureSearch onSelect={handleDentalProcedureSelect} />
        {selectedDentalProcedures.length > 0 && (
          <div className="selected-items">
            Selected Dental Procedures:
            <ul>
              {selectedDentalProcedures.map((dp) => (
                <li key={dp.id}>
                  {dp.serviceName} ({dp.arabicName})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment Amount Input */}
        <div className="form-group">
          <label htmlFor="paymentAmount">💵Payment Amount</label>
          <input
            type="number"
            id="paymentAmount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            min="0"
            step="1"
          />
        </div>

        {/* Doctor Notes */}
        <div className="form-group">
          <label htmlFor="doctorNotes">📝Doctor Notes</label>
          <textarea
            id="doctorNotes"
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
          />
        </div>

        <button type="submit">💾Record Visit</button>
      </form>
    </div>
  );
};

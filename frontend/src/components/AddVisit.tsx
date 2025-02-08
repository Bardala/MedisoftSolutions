import React from "react";
import { useAddVisit } from "../hooks/useVisit";
import PatientSearch from "./PatientSearch";
import DentalProcedureSearch from "./DentalProcedureSearch";
import "../styles/addVisit.css";

export const AddVisit: React.FC = () => {
  const {
    setPaymentAmount,
    handleDentalProcedureSelect,
    handlePatientSelect,
    selectedDentalProcedures,
    selectedPatient,
    paymentAmount,
    handleSubmit,
    successMessage,
    createdVisitDetails,
    createdPaymentDetails,
  } = useAddVisit();

  return (
    <div className="add-visit-container">
      <h2>📋Record Visit</h2>

      {successMessage && (
        <div className="success-message">
          <p>✅ {successMessage}</p>
          {createdVisitDetails && (
            <div>
              <h3>🦷 Visit Details:</h3>
              <p>
                📄 Visit ID: <strong>{createdVisitDetails.visitId}</strong>
              </p>
              <p>
                👤 Patient: <strong>{createdVisitDetails.patientName}</strong>
              </p>
              <p>
                🩺 Doctor: <strong>{createdVisitDetails.doctorName}</strong>
              </p>
              <p>📝 Dental Procedures:</p>
              {createdVisitDetails.procedures?.map((p, index) => (
                <p key={index}>
                  <strong>
                    🔹 {p.arabicName}, {p.serviceName}
                  </strong>
                </p>
              ))}
              <p>
                📅 Visit Date: <strong>{createdVisitDetails.visitDate}</strong>
              </p>
            </div>
          )}
          {createdPaymentDetails && (
            <div>
              <h3>💳 Payment Details:</h3>
              <p>
                🔢 Payment ID:{" "}
                <strong>{createdPaymentDetails.paymentId}</strong>
              </p>
              <p>
                💰 Amount: <strong>💵 {createdPaymentDetails.amount}</strong>
              </p>
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
            // type="number"
            id="paymentAmount"
            placeholder="Enter Payment Amount 💵"
            value={paymentAmount > 0 ? paymentAmount : ""}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            // min="0"
            // step="1"
          />
        </div>
        <button type="submit">💾Record Visit</button>
      </form>
    </div>
  );
};

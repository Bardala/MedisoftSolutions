import React from "react";
import { useIntl } from "react-intl";
import { useAddVisit } from "../hooks/useVisit";
import PatientSearch from "./PatientSearch";
import "../styles/addVisit.css";

export const AddVisit: React.FC = () => {
  const { formatMessage: f } = useIntl();
  const {
    setPaymentAmount,
    handlePatientSelect,
    selectedPatient,
    paymentAmount,
    handleSubmit,
    successMessage,
    createdVisitDetails,
    createdPaymentDetails,
  } = useAddVisit();

  return (
    <div className="add-visit-container">
      <h2>{f({ id: "addVisit.recordVisitTitle" })}</h2>

      {successMessage && (
        <div className="success-message">
          <p>
            {f({ id: "addVisit.RecordedSuccessfully" }, { successMessage })}
          </p>

          {createdVisitDetails && (
            <div>
              <h3>{f({ id: "addVisit.visitDetailsTitle" })}</h3>
              <p>
                {f(
                  { id: "addVisit.visitId" },
                  { visitId: createdVisitDetails.visitId },
                )}
              </p>
              <p>
                {f(
                  { id: "addVisit.patientName" },
                  { patientName: createdVisitDetails.patientName },
                )}
              </p>
              <p>
                {f(
                  { id: "addVisit.recordedBy" },
                  { doctorName: createdVisitDetails.doctorName },
                )}
              </p>
              <p>
                {f(
                  { id: "addVisit.visitDate" },
                  { visitDate: createdVisitDetails.visitDate },
                )}
              </p>
            </div>
          )}

          {createdPaymentDetails && (
            <div>
              <h3>{f({ id: "addVisit.paymentDetailsTitle" })}</h3>
              <p>
                {f(
                  { id: "addVisit.paymentId" },
                  { paymentId: createdPaymentDetails.paymentId },
                )}
              </p>
              <p>
                {f(
                  { id: "addVisit.paymentAmount" },
                  { amount: createdPaymentDetails.amount },
                )}
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <PatientSearch onSelect={handlePatientSelect} />
        {selectedPatient && (
          <div className="selected-items">
            {f(
              { id: "addVisit.selectedPatient" },
              {
                fullName: selectedPatient.fullName,
                phone: selectedPatient.phone,
              },
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="paymentAmount">
            {f({ id: "addVisit.paymentAmountLabel" })}
          </label>
          <input
            id="paymentAmount"
            placeholder={f({ id: "addVisit.paymentAmountPlaceholder" })}
            value={paymentAmount > 0 ? paymentAmount : ""}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
          />
        </div>

        <button type="submit">{f({ id: "addVisit.recordVisitButton" })}</button>
      </form>
    </div>
  );
};

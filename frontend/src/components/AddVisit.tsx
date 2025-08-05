import React from "react";
import { useIntl } from "react-intl";
import { useAddVisit } from "../hooks/useVisit";
import PatientSearch from "./PatientSearch";
import "../styles/addVisit.css";
import { DoctorSelect } from "./DoctorSelect";
import { Payment, Visit } from "../types";
import { dailyTimeFormate, monthlyTimeFormate } from "../utils";

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
    isLoading,
    setScheduledTime,
    setReason,
    scheduledTime,
    reason,
  } = useAddVisit();

  return (
    <div className="add-visit-container">
      <h2>
        {f({ id: "addVisit.recordVisitTitle" })}

        <DoctorSelect />
      </h2>

      <SuccessVisitCreatedCard
        successMessage={successMessage}
        createdVisitDetails={createdVisitDetails}
        createdPaymentDetails={createdPaymentDetails}
      />

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

        {/* New Scheduled Time Field */}
        <div className="form-group">
          <label htmlFor="scheduledTime">
            {f({ id: "addVisit.scheduledTimeLabel" })}
          </label>
          <input
            id="scheduledTime"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>

        {/* New Reason Field */}
        <div className="form-group">
          <label htmlFor="reason">{f({ id: "addVisit.reasonLabel" })}</label>
          <input
            id="reason"
            placeholder={f({ id: "addVisit.reasonPlaceholder" })}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Existing Payment Amount Field */}
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

        <button type="submit" disabled={isLoading || !selectedPatient}>
          {f({ id: "addVisit.recordVisitButton" })}
        </button>
      </form>
    </div>
  );
};

interface SuccessVisitCreatedCardProps {
  successMessage: string | null;
  createdVisitDetails: Visit | null;
  createdPaymentDetails: Payment | null;
}

const SuccessVisitCreatedCard = ({
  successMessage,
  createdVisitDetails,
  createdPaymentDetails,
}: SuccessVisitCreatedCardProps) => {
  const { formatMessage: f } = useIntl();

  if (!successMessage) return null;

  return (
    <div className="success-message">
      <p>{f({ id: "addVisit.RecordedSuccessfully" }, { successMessage })}</p>

      {createdVisitDetails && (
        <div>
          <h3>{f({ id: "addVisit.visitDetailsTitle" })}</h3>
          <p>
            {f({ id: "addVisit.visitId" }, { visitId: createdVisitDetails.id })}
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
              { visitDate: dailyTimeFormate(createdVisitDetails.createdAt) },
            )}
          </p>

          {createdVisitDetails.reason && (
            <p>
              {f(
                { id: "addVisit.reason" },
                {
                  reason:
                    createdVisitDetails.reason || f({ id: "not_available" }),
                },
              )}
            </p>
          )}

          {createdVisitDetails.scheduledTime && (
            <p>
              {f(
                { id: "addVisit.scheduledTime" },
                {
                  scheduledTime:
                    monthlyTimeFormate(createdVisitDetails.scheduledTime) ||
                    f({ id: "not_available" }),
                },
              )}
            </p>
          )}
        </div>
      )}

      {createdPaymentDetails && (
        <div>
          <h3>{f({ id: "addVisit.paymentDetailsTitle" })}</h3>
          <p>
            {f(
              { id: "addVisit.paymentId" },
              { paymentId: createdPaymentDetails.id },
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
  );
};

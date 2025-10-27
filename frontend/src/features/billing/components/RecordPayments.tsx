import React, { useState } from "react";
import { useIntl } from "react-intl"; // Import react-intl for translations
import "@styles/cardComponents.css";

import { useLogin } from "@/app";
import { PatientSearch } from "@/features/patients";
import { Patient } from "@/shared";
import { isArabic } from "@/utils";
import { useRecordPayment } from "../hooks";

const RecordPayments: React.FC = () => {
  const { loggedInUser } = useLogin();
  const { formatMessage: f } = useIntl(); // Initialize translations
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { mutation: paymentMutation } = useRecordPayment();
  const [payments, setPayments] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({ amount: 0 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPatient && paymentDetails.amount) {
      try {
        const newPayment = await paymentMutation.mutateAsync({
          amount: Number(paymentDetails.amount),
          patientId: selectedPatient.id,
          recordedById: loggedInUser.id, // Replace with actual user ID
        });
        setPayments((prev) => [
          ...prev,
          {
            ...paymentDetails,
            name: selectedPatient.fullName,
            id: newPayment.id,
          },
        ]);
        setPaymentDetails({ amount: 0 });
      } catch (error) {
        console.error(f({ id: "error_recording_payment" }), error);
      }
    }
  };

  return (
    <div className="card-container">
      <div className="record-payments">
        <h2>{f({ id: "record_payments" })}</h2>
        <PatientSearch onSelect={setSelectedPatient} />

        <form onSubmit={addPayment}>
          <input
            className={isArabic(selectedPatient?.fullName) ? "arabic" : ""}
            type="text"
            name="name"
            placeholder={f({ id: "patient_name" })}
            value={selectedPatient ? selectedPatient?.fullName : ""}
            readOnly
            required
          />
          <input
            name="amount"
            placeholder={f({ id: "amount_paid" })}
            value={paymentDetails.amount > 0 ? paymentDetails.amount : ""}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            disabled={!selectedPatient || !paymentDetails.amount}
          >
            {f({ id: "add_payment" })}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>{f({ id: "patient_name" })}</th>
              <th>{f({ id: "amount_paid" })}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.name}</td>
                <td>{payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordPayments;

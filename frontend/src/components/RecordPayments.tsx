import React, { useState } from "react";
import "../styles/cardComponents.css";
import PatientSearch from "./PatientSearch";
import { useRecordPayment } from "../hooks/usePayment";
import { useLogin } from "../context/loginContext";
import { Patient } from "../types";

const RecordPayments: React.FC = () => {
  const { loggedInUser } = useLogin();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { mutation: paymentMutation } = useRecordPayment();
  const [payments, setPayments] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
  });

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
          patient: { id: selectedPatient.id },
          recordedBy: { id: loggedInUser.id }, // Replace with actual user ID
        });
        setPayments((prev) => [
          ...prev,
          {
            ...paymentDetails,
            name: selectedPatient.fullName,
            id: newPayment.id,
          },
        ]);
        setPaymentDetails({ amount: "" });
      } catch (error) {
        console.error("Error recording payment:", error);
      }
    }
  };

  return (
    <div className="card-container">
      <div className="record-payments">
        <h2>Record Payments</h2>
        <PatientSearch onSelect={setSelectedPatient} />

        <form onSubmit={addPayment}>
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={selectedPatient ? selectedPatient.fullName : ""}
            readOnly
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount Paid"
            value={paymentDetails.amount}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            disabled={!selectedPatient || !paymentDetails.amount}
          >
            Add
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Amount Paid</th>
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

import React, { useState } from "react";
import "../styles/cardComponents.css";

const RecordPayments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    amount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const addPayment = (e) => {
    e.preventDefault();
    if (paymentDetails.name && paymentDetails.amount) {
      setPayments((prev) => [...prev, { ...paymentDetails, id: Date.now() }]);
      setPaymentDetails({ name: "", amount: "" });
    }
  };

  return (
    <div className="card-container">
      <div className="record-payments">
        <h2>Record Payments</h2>
        <form onSubmit={addPayment}>
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={paymentDetails.name}
            onChange={handleInputChange}
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
          <button type="submit">Add</button>
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

import React, { useState } from "react";
import "../styles/cardComponents.css";
const AddPatient = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    phone: "",
    birthDate: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Patient registered successfully!");
    // Save patient details logic here
  };

  return (
    <div className="card-container">
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={patientDetails.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={patientDetails.phone}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="birthDate"
          value={patientDetails.birthDate}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={patientDetails.notes}
          onChange={handleInputChange}
        />
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPatient;

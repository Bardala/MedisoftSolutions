import React, { useState } from "react";

const CurrentPatientProfile = ({ patient }) => {
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    console.log("Saving new notes:", notes);
  };

  return (
    <div className="card-container">
      <h2>Current Patient Profile Summary</h2>
      <p>
        <strong>Name:</strong> {patient.name}
      </p>
      <p>
        <strong>Phone:</strong> {patient.phone}
      </p>
      <p>
        <strong>Medical History:</strong> {patient.medicalHistory}
      </p>
      <p>
        <strong>Previous Procedures:</strong> {patient.procedures}
      </p>
      <p>
        <strong>Payments:</strong> {patient.payments}
      </p>
      <p>
        <strong>Last Visit:</strong> {patient.lastVisit}
      </p>
      <textarea
        placeholder="Add new notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={handleSave}>Save Updates</button>
    </div>
  );
};

export default CurrentPatientProfile;

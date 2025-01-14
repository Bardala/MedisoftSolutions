import React from "react";
import { useCreatePatient } from "../hooks/usePatient"; // Adjust the path to your hook
import "../styles/cardComponents.css";

const AddPatient: React.FC = () => {
  const {
    success,
    createPatient,
    isLoading,
    isError,
    error,
    patient,
    dispatch,
  } = useCreatePatient();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "fullName":
        dispatch({ type: "SET_FULL_NAME", payload: value });
        break;
      // case "dateOfBirth":
      //   dispatch({ type: "SET_DATE_OF_BIRTH", payload: new Date(value) });
      //   break;
      case "age":
        dispatch({ type: "SET_AGE", payload: Number(value) });
        break;
      case "address":
        dispatch({ type: "SET_ADDRESS", payload: value });
        break;
      case "medicalHistory":
        dispatch({ type: "SET_MEDICAL_HISTORY", payload: value });
        break;
      case "notes":
        dispatch({ type: "SET_NOTES", payload: value });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPatient(patient);
      dispatch({ type: "RESET" }); // Reset the form fields
    } catch (err) {
      console.error("Error creating patient:", err);
    }
  };

  // const handleDentalProcedureSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Dental Procedure Submitted");
  // };

  // const handlePaymentSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Payment Submitted");
  // };

  return (
    <div className="card-container">
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <div className="icon-description">
            <span className="icon">👤</span>
            <span>Full Name</span>
          </div>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={patient.fullName || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <div className="icon-description">
            <span className="icon">📞</span>
            <span>Phone Number</span>
          </div>
          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            value={patient.phone}
            onChange={(e) =>
              dispatch({
                type: "SET_PHONE",
                payload: Number(e.target.valueAsNumber),
              })
            }
            required
          />
        </div>

        {/* Date of Birth */}
        {/* <div className="form-group">
          <div className="icon-description">
            <span className="icon">🎂</span>
            <span>Date of Birth (optional)</span>
          </div>
          <input
            type="date"
            name="dateOfBirth"
            value={
              patient.dateOfBirth
                ? patient.dateOfBirth.toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
          />
        </div> */}

        {/* Age */}
        <div className="form-group">
          <div className="icon-description">
            <span className="icon">📅</span>
            <span>Age (optional)</span>
          </div>
          <input
            type="number"
            name="age"
            placeholder="Age (optional)"
            value={patient.age || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <div className="icon-description">
            <span className="icon">🏠</span>
            <span>Address (optional)</span>
          </div>
          <input
            type="text"
            name="address"
            placeholder="Address (optional)"
            value={patient.address || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Medical History */}
        <div className="form-group">
          <div className="icon-description">
            <span className="icon">💊</span>
            <span>Medical History (optional)</span>
          </div>
          <textarea
            name="medicalHistory"
            placeholder="Medical History (optional)"
            value={patient.medicalHistory || ""}
            onChange={handleInputChange}
          />
        </div>
        {/* //todo: create Record Visit, which let you choose the patient and the dental procedure */}
        {/* <div className="form-group">
          <div className="icon-description">
            <span className="icon">🦷</span>
            <span>Procedure (optional)</span>
          </div>
          <input
            type="text"
            name="procedure"
            placeholder="Procedure Name"
            required
          />
        </div> */}

        {/* Notes */}
        <div className="form-group">
          <div className="icon-description">
            <span className="icon">📝</span>
            <span>Notes (optional)</span>
          </div>
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={patient.notes || ""}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>

      {success && <p className="success">Patient registered successfully!</p>}
      {isError && <p className="error">Error: {error?.message}</p>}

      {/* Dental Procedure Form */}
      {/* <h2>Add Dental Procedure</h2>
      <form onSubmit={handleDentalProcedureSubmit}> */}
      {/* <div className="form-group">
          <div className="icon-description">
            <span className="icon">🦷</span>
            <span>Procedure (optional)</span>
          </div>
          <input
            type="text"
            name="procedure"
            placeholder="Procedure Name"
            required
          />
        </div> */}
      {/* <div className="form-group">
          <label>Visit Date</label>
          <input type="date" name="visitDate" required />
        </div> */}
      {/* <button type="submit">Save Procedure</button>
      </form> */}

      {/* Payment Form */}
      {/* <h2>Record Payment</h2>
      <form onSubmit={handlePaymentSubmit}> */}
      {/* <div className="form-group">
          <div className="icon-description">
            <span className="icon">💵</span>
            <span>Amount (optional)</span>
          </div>
          <input
            type="number"
            name="amount"
            placeholder="Payment Amount"
            required
          />
        </div> */}
      {/* <div className="form-group">
          <label>Payment Date</label>
          <input type="date" name="paymentDate" required />
        </div> */}
      {/* <button type="submit">Record Payment</button>
      </form> */}
    </div>
  );
};

export default AddPatient;

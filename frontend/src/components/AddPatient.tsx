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
      case "phone":
        dispatch({ type: "SET_PHONE", payload: Number(value) });
        break;
      case "dateOfBirth":
        dispatch({ type: "SET_DATE_OF_BIRTH", payload: new Date(value) });
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

  return (
    <div className="card-container">
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Patient Name"
          value={patient.fullName}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone Number"
          value={patient.phone || ""}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="dateOfBirth"
          value={
            patient.dateOfBirth
              ? patient.dateOfBirth.toISOString().split("T")[0]
              : ""
          }
          onChange={handleInputChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={patient.notes || ""}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>

      {success && <p>Patient registered successfully!</p>}
      {isError && <p className="error">Error: {error?.message}</p>}
    </div>
  );
};

export default AddPatient;

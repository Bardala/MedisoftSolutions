import React from "react";
import { usePatientSearch } from "../hooks/usePatientSearch";
import { Patient } from "../types";

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onSelect }) => {
  const {
    patients,
    searchTerm,
    setSearchTerm,
    handlePatientSelect,
    isLoading,
    error,
  } = usePatientSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelect = (patient: Patient) => {
    handlePatientSelect(patient);
    onSelect(patient);
  };

  return (
    <div className="form-group">
      <label htmlFor="patient">🧑‍⚕️Select Patient</label>
      <input
        type="text"
        id="patient"
        placeholder="Search by name or phone number"
        value={searchTerm}
        onChange={handleSearch}
        aria-label="Search for a patient by name or phone number"
      />
      {isLoading && <p>Loading patients...</p>}
      {error && <p>Error loading patients</p>}
      {searchTerm && patients && patients.length > 0 && (
        <ul className="search-results">
          {patients.map((patient) => (
            <li
              key={patient.id}
              onClick={() => handleSelect(patient)}
              className="search-result-item"
            >
              {patient.fullName} - {patient.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientSearch;

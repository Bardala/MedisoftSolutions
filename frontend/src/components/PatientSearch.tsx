import React from "react";
import { usePatientSearch } from "../hooks/usePatientSearch";
import { Patient } from "../types";
import { isArabic } from "../utils";
import { useIntl } from "react-intl";

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onSelect }) => {
  const { formatMessage: f } = useIntl();

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
      <label htmlFor="patient">{f({ id: "select_patient" })}</label>
      <input
        className={isArabic(searchTerm) ? "arabic" : ""}
        type="text"
        id="patient"
        placeholder={f({ id: "search_placeholder" })}
        value={searchTerm}
        onChange={handleSearch}
        aria-label={f({ id: "search_placeholder" })}
      />
      {isLoading && <p>{f({ id: "loading_patients" })}</p>}
      {error && <p>{f({ id: "error_loading_patients" })}</p>}
      {searchTerm && patients && patients.length > 0 && (
        <ul className="search-results arabic">
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

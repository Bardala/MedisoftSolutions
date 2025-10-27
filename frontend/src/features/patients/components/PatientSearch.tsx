import { FC } from "react";
import { useIntl } from "react-intl";
import { Patient } from "@/shared/types";
import { isArabic } from "@/utils";
import { usePatientSearch } from "../hooks/usePatient";

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
}

const PatientSearch: FC<PatientSearchProps> = ({ onSelect }) => {
  const { formatMessage: f } = useIntl();

  const {
    patients,
    searchParams,
    setSearchParams,
    handlePatientSelect,
    error,
  } = usePatientSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    // Use the special 'patient' param that searches both name and phone
    setSearchParams({ patient: value });
  };

  const handleSelect = (patient: Patient) => {
    handlePatientSelect(patient);
    onSelect(patient); // Notify parent component
    // Clear search after selection
    setSearchParams({});
  };

  // Get the current search term for input value
  const searchTerm = searchParams.patient || "";

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

      {error && <p>{f({ id: "error_loading_patients" })}</p>}
      {searchTerm && patients.length > 0 && (
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

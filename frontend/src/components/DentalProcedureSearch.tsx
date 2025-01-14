import React from "react";
import { useDentalProcedureSearch } from "../hooks/useDentalProcedureSearch";
import { DentalProcedure } from "../types";

interface DentalProcedureSearchProps {
  onSelect: (dentalProcedure: DentalProcedure) => void;
}

const DentalProcedureSearch: React.FC<DentalProcedureSearchProps> = ({
  onSelect,
}) => {
  const {
    dentalProcedures,
    selectedDentalProcedures,
    searchTerm,
    setSearchTerm,
    handleDentalProcedureSelect,
    isLoading,
    error,
  } = useDentalProcedureSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="form-group">
      <label htmlFor="dentalProcedure">🦷Select Dental Procedure</label>
      <input
        type="text"
        id="dentalProcedure"
        placeholder="Search by name or description"
        value={searchTerm}
        onChange={handleSearch}
        aria-label="Search for a dental procedure by name or description"
      />
      {isLoading && <p>Loading dental procedures...</p>}
      {error && <p>Error loading dental procedures</p>}
      {searchTerm && dentalProcedures && dentalProcedures.length > 0 && (
        <ul className="search-results">
          {dentalProcedures.map((dentalProcedure) => (
            <li
              key={dentalProcedure.id}
              onClick={() => {
                handleDentalProcedureSelect(dentalProcedure);
                onSelect(dentalProcedure);
              }}
              className={`search-result ${
                selectedDentalProcedures.some(
                  (dp) => dp.id === dentalProcedure.id,
                )
                  ? "selected"
                  : ""
              }`}
            >
              {dentalProcedure.serviceName} ({dentalProcedure.arabicName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DentalProcedureSearch;

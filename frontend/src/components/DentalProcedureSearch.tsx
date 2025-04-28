import React from "react";
import { useDentalProcedureSearch } from "../hooks/useDentalProcedureSearch";
import { DentalProcedure } from "../types";
import { useIntl } from "react-intl";

interface DentalProcedureSearchProps {
  onSelect: (dentalProcedure: DentalProcedure) => void;
}

const DentalProcedureSearch: React.FC<DentalProcedureSearchProps> = ({
  onSelect,
}) => {
  const { formatMessage: f } = useIntl();
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
      <label htmlFor="dentalProcedure">{f({ id: "select" })}</label>
      <input
        type="text"
        id="dentalProcedure"
        placeholder={f({ id: "searchPlaceholder" })}
        value={searchTerm}
        onChange={handleSearch}
        aria-label={f({ id: "searchPlaceholder" })}
      />
      {isLoading && <p>{f({ id: "loading" })}</p>}
      {error && <p>{f({ id: "error" })}</p>}
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

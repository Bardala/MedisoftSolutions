import { useRecordVisitsProcedures } from "@/features/visits";
import { Visit } from "@/shared";
import React from "react";
import { useIntl } from "react-intl";
import { useDentalProcedureSearch } from "../hooks";

interface DentalProcedureSearchProps {
  visit: Visit;
}

const DentalProcedureSearch: React.FC<DentalProcedureSearchProps> = ({
  visit,
}) => {
  const { formatMessage: f } = useIntl();
  const {
    dentalProcedures,
    selectedDentalProcedures: selectedDentalProceduresSearch,
    searchTerm,
    setSearchTerm,
    handleDentalProcedureSelect: handleDentalProcedureSelectSearch,
    isLoading,
    error,
  } = useDentalProcedureSearch();
  const {
    handleDentalProcedureSelect,
    selectedDentalProcedures,
    handleRecordVisitProcedures,
    setSelectedDentalProcedures,
  } = useRecordVisitsProcedures();

  // const { updateProcedureMutation } = useUpdateProcedure();
  // const { deleteProcedureMutation } = useDeleteProcedure();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  const handleSubmitAddDp = async () => {
    await handleRecordVisitProcedures(visit.id);
    setSelectedDentalProcedures([]);
  };

  return (
    <div className="form-group">
      <label htmlFor="dentalProcedure">
        {f({ id: "dentalProcedure.select" })}
      </label>
      <input
        type="text"
        id="dentalProcedure"
        placeholder={f({ id: "dentalProcedure.searchPlaceholder" })}
        value={searchTerm}
        onChange={handleSearch}
        aria-label={f({ id: "dentalProcedure.searchPlaceholder" })}
        disabled
      />
      {isLoading && <p>{f({ id: "dentalProcedure.loading" })}</p>}
      {error && <p>{f({ id: "dentalProcedure.error" })}</p>}
      {searchTerm && dentalProcedures && dentalProcedures.length > 0 && (
        <ul className="search-results">
          {dentalProcedures.map((dentalProcedure) => (
            <li
              key={dentalProcedure.id}
              onClick={() => {
                handleDentalProcedureSelectSearch(dentalProcedure);
                handleDentalProcedureSelect(dentalProcedure);
              }}
              className={`search-result ${
                selectedDentalProceduresSearch.some(
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

      {selectedDentalProcedures.length > 0 && (
        <div className="selected-items">
          {f({ id: "selectedDentalProcedures" })}:
          <ul>
            {selectedDentalProcedures.map((dp) => (
              <li key={dp.id}>
                {dp.serviceName} ({dp.arabicName})
              </li>
            ))}
          </ul>
          {selectedDentalProcedures.length > 0 && (
            <>
              <button onClick={handleSubmitAddDp} title={f({ id: "add" })}>
                {f({ id: "add" })}
              </button>
              <button onClick={() => setSelectedDentalProcedures([])}>
                {f({ id: "cancel" })}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DentalProcedureSearch;

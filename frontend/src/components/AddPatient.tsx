import { useState } from "react";
import { useIntl } from "react-intl";
import { useCreatePatient } from "../hooks/usePatient";
import "../styles/cardComponents.css";
import { isArabic } from "../utils";
import { usePatientSearch } from "../hooks/usePatientSearch";

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
  const [showInfo, setShowInfo] = useState(false);
  const { allPatients } = usePatientSearch();

  const { formatMessage: f } = useIntl();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        dispatch({ type: "SET_FULL_NAME", payload: value });
        break;
      case "age":
        dispatch({ type: "SET_AGE", payload: Number(value) });
        break;
      case "notes":
        dispatch({ type: "SET_NOTES", payload: value });
        break;
      case "address":
        dispatch({ type: "SET_ADDRESS", payload: value });
        break;
      case "medicalHistory":
        return { type: "SET_MEDICAL_HISTORY", payload: value };
      default:
        break;
    }
  };
  const [showAddressList, setShowAddressList] = useState(false);
  const [showMedicalHistoryList, setShowMedicalHistoryList] = useState(false);
  const uniqueAddresses = Array.from(
    new Set(allPatients?.map((p) => p.address) || []),
  );
  const uniqueMedicalHistories = Array.from(
    new Set(allPatients?.map((p) => p.medicalHistory) || []),
  );
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
      <h2>{f({ id: "title" })}</h2>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <input
            className={isArabic(patient.fullName) ? "arabic" : ""}
            type="text"
            name="fullName"
            placeholder={f({ id: "fullNamePlaceholder" })}
            value={patient.fullName || ""}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="info-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            ❗
          </button>

          {showInfo && (
            <div className="info-message arabic">
              <p>{f({ id: "arabicNameWarning" })}</p>
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder={f({ id: "phonePlaceholder" })}
            value={patient.phone}
            onChange={(e) =>
              dispatch({
                type: "SET_PHONE",
                payload: e.target.value,
              })
            }
            required
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder={f({ id: "agePlaceholder" })}
            value={patient.age || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <div className="search-container">
            <input
              type="text"
              placeholder={f({ id: "addressPlaceholder" })}
              name="address"
              value={patient.address}
              onChange={(e) =>
                dispatch({ type: "SET_ADDRESS", payload: e.target.value })
              }
              onFocus={() => setShowAddressList(true)}
              onBlur={() => setTimeout(() => setShowAddressList(false), 200)}
            />
            {showAddressList && (
              <ul className="search-list visible">
                {uniqueAddresses &&
                  uniqueAddresses
                    .filter((add) =>
                      add.toLowerCase().includes(patient.address.toLowerCase()),
                    )
                    .map((add, index) => (
                      <li
                        key={index}
                        onClick={(e) => {
                          dispatch({ type: "SET_ADDRESS", payload: add });
                        }}
                      >
                        {add}
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </div>

        {/* Medical History */}
        <div className="form-group">
          <div className="search-container">
            <input
              type="text"
              name="medicalHistory"
              placeholder={f({
                id: "medicalHistoryPlaceholder",
              })}
              value={patient.medicalHistory || ""}
              // onChange={handleInputChange}
              onChange={(e) =>
                dispatch({
                  type: "SET_MEDICAL_HISTORY",
                  payload: e.target.value,
                })
              }
              onFocus={() => setShowMedicalHistoryList(true)}
              onBlur={() =>
                setTimeout(() => setShowMedicalHistoryList(false), 200)
              }
            />
            {showMedicalHistoryList && (
              <ul className="search-list visible">
                {uniqueMedicalHistories &&
                  uniqueMedicalHistories
                    .filter((md) =>
                      md
                        .toLowerCase()
                        .includes(patient.medicalHistory.toLowerCase()),
                    )
                    .map((md, index) => (
                      <li
                        key={index}
                        onClick={(e) => {
                          dispatch({
                            type: "SET_MEDICAL_HISTORY",
                            payload: md,
                          });
                        }}
                      >
                        {md}
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <textarea
            className={isArabic(patient.notes) ? "arabic" : ""}
            name="notes"
            placeholder={f({ id: "notesPlaceholder" })}
            value={patient.notes || ""}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? f({ id: "savingButton" }) : f({ id: "submitButton" })}
        </button>
      </form>

      {success && <p className="success">{f({ id: "successMessage" })}</p>}
      {isError && (
        <p className="error">
          {f({ id: "errorMessage" }, { error: error?.message })}
        </p>
      )}
    </div>
  );
};

export default AddPatient;

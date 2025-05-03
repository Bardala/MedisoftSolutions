import { useIntl } from "react-intl";
import { useDoctorSelection, useFetchDoctors } from "../hooks/useDoctors";
import "../styles/doctorSelect.css";
import { useLogin } from "../context/loginContext";
import { useEffect } from "react";
import { LOCALS } from "../utils";

export const DoctorSelect = () => {
  const { loggedInUser } = useLogin();
  const { formatMessage: f } = useIntl();
  const { doctors, isLoading, isError, error } = useFetchDoctors();
  const { selectedDoctorId, setSelectedDoctorId } = useDoctorSelection();

  // Save selected doctor ID to localStorage when it changes
  useEffect(() => {
    if (loggedInUser.role === "Assistant" && selectedDoctorId) {
      localStorage.setItem(LOCALS.SELECTED_DOCTOR_ID, String(selectedDoctorId));
    }
  }, [selectedDoctorId, loggedInUser.role]);

  if (isLoading)
    return <div className="loading-text">{f({ id: "loading" })}</div>;
  if (isError)
    return (
      <div className="error-text">
        {f({ id: "error" })}: {error?.message}
      </div>
    );

  return (
    loggedInUser.role === "Assistant" &&
    doctors.length > 1 && (
      <div className="doctor-select-container">
        <label htmlFor="doctor-select" className="doctor-select-label">
          {f({ id: "selectDoctor" })}:
        </label>
        <select
          id="doctor-select"
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
          className="doctor-select"
          disabled={!doctors || doctors.length === 0}
        >
          {doctors?.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
              {/* ({doctor.username}) */}
            </option>
          ))}
        </select>
      </div>
    )
  );
};

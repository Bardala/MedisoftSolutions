import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { PatientPage, PatientSearch } from "@/features/patients";
import PatientsTable from "@/features/patients/components/PatientsTable";
import { Patient } from "@/shared";
import "@styles/getRegistry.css";

export const GetRegistry: FC = () => {
  const { formatMessage: f } = useIntl();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
    }
  };

  return (
    <div className="registry-container">
      <h1>
        <FontAwesomeIcon icon={faSearch} /> {f({ id: "registry" })}
      </h1>

      <div className="search-container">
        <PatientSearch onSelect={(p) => setSelectedPatient(p)} />

        {selectedPatient && (
          <button className="search-button" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faSearch} /> {selectedPatient.fullName}
          </button>
        )}
      </div>

      {patientId ? <PatientPage patientId={patientId} /> : <PatientsTable />}
    </div>
  );
};

export default GetRegistry;

import { FC } from "react";
import { Patient } from "../types";
import { AddressDistributionChart } from "./AddressDistributionChart";
import { AgeDistributionChart } from "./AgeDistributionChart";
import { PatientRegistrationTrendChart } from "./PatientRegistrationTrendChart";
import { useGetAllPatients } from "../hooks/usePatient";

export const PatientsCharts: FC<{ patients: Patient[] }> = ({ patients }) => {
  const { allPatients } = useGetAllPatients();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {allPatients && (
        <>
          <AgeDistributionChart patients={allPatients} />
          <AddressDistributionChart patients={allPatients} />
          <PatientRegistrationTrendChart patients={allPatients} />
        </>
      )}
    </div>
  );
};

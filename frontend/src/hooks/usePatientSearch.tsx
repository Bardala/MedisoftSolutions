import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAllPatients } from "../fetch/api";
import { Patient } from "../types";

export const usePatientSearch = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: patients,
    isLoading,
    error,
  } = useQuery(["patients"], GetAllPatients);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(""); // Clear search term after selection
  };

  const filteredPatients = patients?.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toString().includes(searchTerm),
  );

  return {
    patients: filteredPatients,
    selectedPatient,
    searchTerm,
    setSearchTerm,
    handlePatientSelect,
    isLoading,
    error,
    allPatients: patients,
  };
};

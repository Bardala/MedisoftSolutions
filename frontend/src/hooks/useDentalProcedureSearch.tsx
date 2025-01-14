import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAllDentalProceduresApi } from "../fetch/api";
import { DentalProcedure } from "../types";

export const useDentalProcedureSearch = () => {
  const [selectedDentalProcedures, setSelectedDentalProcedures] = useState<
    DentalProcedure[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: dentalProcedures,
    isLoading,
    error,
  } = useQuery(["dentalProcedures"], GetAllDentalProceduresApi);

  const handleDentalProcedureSelect = (dentalProcedure: DentalProcedure) => {
    setSelectedDentalProcedures((prev) => [...prev, dentalProcedure]);
    setSearchTerm(""); // Clear search term after selection
  };

  const filteredDentalProcedures = dentalProcedures?.filter(
    (dp) =>
      dp.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dp.arabicName.toLowerCase().includes(searchTerm),
  );

  return {
    dentalProcedures: filteredDentalProcedures,
    selectedDentalProcedures,
    searchTerm,
    setSearchTerm,
    handleDentalProcedureSelect,
    isLoading,
    error,
  };
};

import { GetAllProceduresApi } from "@/core";
import { Procedure } from "@/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useDentalProcedureSearch = () => {
  const [selectedDentalProcedures, setSelectedDentalProcedures] = useState<
    Procedure[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: dentalProcedures,
    isLoading,
    error,
  } = useQuery(["dentalProcedures"], GetAllProceduresApi);

  const handleDentalProcedureSelect = (dentalProcedure: Procedure) => {
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

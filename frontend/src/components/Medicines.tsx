import React, { FC, useState } from "react";
import { Visit, Medicine, VisitMedicine } from "../types";
import {
  useDeleteVisitMedicine,
  useGetVisitMedicinesByVisitId,
} from "../hooks/useVisitMedicine";
import PrescriptionForm from "./PrescriptionForm";
import Table from "./Table";
import "../styles/medicines.css";

export const Medicines: FC<{ visit: Visit }> = ({ visit }) => {
  const [, setPrescriptions] = useState<Medicine[]>([]);
  const { query: visitMedicinesQuery } = useGetVisitMedicinesByVisitId(
    visit?.id,
  );
  const visitMedicines = visitMedicinesQuery.data as unknown as VisitMedicine[];
  const { deleteMutation: deleteVMMutation } = useDeleteVisitMedicine();

  // Handle prescription submission
  const handlePrescriptionSubmit = (medicine: Medicine) => {
    setPrescriptions((prev) => [...prev, medicine]);
  };

  // Define columns for the medicines table
  const medicineColumns = [
    {
      header: "Medicine Name",
      accessor: (row) => row.medicine.medicineName,
    },
    {
      header: "Dosage",
      accessor: (row) => row.medicine.dosage,
    },
    {
      header: "Frequency",
      accessor: (row) => row.medicine.frequency || "N/A",
    },
    {
      header: "Duration (days)",
      accessor: (row) => row.medicine.duration || "N/A",
      expandable: true,
    },
    {
      header: "Instructions",
      accessor: (row) => row.medicine.instructions || "N/A",
      expandable: true,
    },
  ];

  return (
    <div className="medicines-container">
      {/* Prescription Form */}
      <PrescriptionForm
        visit={visit}
        onPrescriptionSubmit={handlePrescriptionSubmit}
      />

      {/* Display VisitMedicines in a table */}
      <div className="visit-medicines-list">
        <h3>Prescribed Medicines</h3>
        <Table
          columns={medicineColumns}
          data={visitMedicines || []}
          enableActions={true} // Disable actions for now
          onDelete={deleteVMMutation.mutate}
        />
      </div>

      {/* <PrescriptionPrint visit={visit} /> */}
    </div>
  );
};

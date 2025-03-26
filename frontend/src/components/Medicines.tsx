import React, { FC, useState } from "react";
import { Visit, Medicine, VisitMedicine } from "../types";
import {
  useDeleteVisitMedicine,
  useGetVisitMedicinesByVisitId,
} from "../hooks/useVisitMedicine";
import PrescriptionForm from "./PrescriptionForm";
import Table from "./Table";
import "../styles/medicines.css";
import { useIntl } from "react-intl";

export const Medicines: FC<{ visit: Visit }> = ({ visit }) => {
  const { formatMessage: f } = useIntl();
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
      header: f({ id: "medicineName" }),
      accessor: (row) => row.medicine.medicineName,
    },
    {
      header: f({ id: "dosage" }),
      accessor: (row) => row.medicine.dosage,
    },
    {
      header: f({ id: "frequency" }),
      accessor: (row) => row.medicine.frequency || "N/A",
    },
    {
      header: f({ id: "duration" }),
      accessor: (row) => row.medicine.duration || "N/A",
      expandable: true,
    },
    {
      header: f({ id: "instructions" }),
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
        <h3>{f({ id: "prescribedMedicines" })}</h3>
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

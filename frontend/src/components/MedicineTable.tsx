import { FC } from "react";
import { useIntl } from "react-intl";
import {
  useGetVisitMedicinesByVisitId,
  useDeleteVisitMedicine,
} from "../hooks/useVisitMedicine";
import { Visit, VisitMedicine } from "../types";
import Table from "./Table";

export const MedicineTable: FC<{ visit: Visit; enableEditing: boolean }> = ({
  visit,
  enableEditing,
}) => {
  const { formatMessage: f } = useIntl();
  const { query: visitMedicinesQuery } = useGetVisitMedicinesByVisitId(
    visit?.id,
  );
  const visitMedicines = visitMedicinesQuery.data as unknown as VisitMedicine[];
  const { deleteMutation: deleteVMMutation } = useDeleteVisitMedicine();

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
    <div className="visit-medicines-list">
      <h4>💊 {f({ id: "prescribedMedicines" })}</h4>
      {visitMedicines?.length > 0 ? (
        <Table
          columns={medicineColumns}
          data={visitMedicines || []}
          enableActions={true} // Disable actions for now
          onDelete={enableEditing ? deleteVMMutation.mutate : null}
        />
      ) : (
        <p>{f({ id: "there_are_no_prescribed_medicines" })}</p>
      )}
    </div>
  );
};

import { FC, useState } from "react";
import { Visit, Medicine } from "../types";
import PrescriptionForm from "./PrescriptionForm";
import "../styles/medicines.css";
import { MedicineTable } from "./MedicineTable";

export const Medicines: FC<{ visit: Visit }> = ({ visit }) => {
  const [, setPrescriptions] = useState<Medicine[]>([]);

  const handlePrescriptionSubmit = (medicine: Medicine) => {
    setPrescriptions((prev) => [...prev, medicine]);
  };

  return (
    <div className="medicines-container">
      <PrescriptionForm
        visit={visit}
        onPrescriptionSubmit={handlePrescriptionSubmit}
      />
      <MedicineTable visit={visit} enableEditing={true} />
    </div>
  );
};

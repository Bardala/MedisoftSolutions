import { FC, useState } from "react";

import "@styles/medicines.css";
import { MedicineTable } from ".";
import { PrescriptionForm } from "@/features/prescriptions";
import { Visit, Medicine } from "@/shared";

const Medicines: FC<{ visit: Visit }> = ({ visit }) => {
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

export default Medicines;

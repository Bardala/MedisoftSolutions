import React, { useState } from "react";
import { Medicine, Visit } from "../types";
import {
  useGetAllMedicines,
  useCreateMedicine,
  useUpdateMedicine,
} from "../hooks/useMedicine";
import { useCreateVisitMedicine } from "../hooks/useVisitMedicine";
import SearchComponent from "./SearchComponent";
import "../styles/prescriptionForm.css";

interface PrescriptionFormProps {
  visit: Visit;
  onPrescriptionSubmit: (medicine: Medicine) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  visit,
  onPrescriptionSubmit,
}) => {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );

  const { query: allMedicinesQuery } = useGetAllMedicines();
  const { createMutation: createMedicineMutation } = useCreateMedicine();
  const { updateMutation: updateMedicineMutation } = useUpdateMedicine();
  const { createMutation: createVisitMedicineMutation } =
    useCreateVisitMedicine();

  const storedMedicines = allMedicinesQuery.data?.sort((a, b) =>
    a.medicineName.localeCompare(b.medicineName),
  ) as unknown as Medicine[];

  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setMedicineName(medicine.medicineName);
    setDosage(medicine.dosage);
    setFrequency(medicine.frequency);
    setDuration(medicine.duration);
    setInstructions(medicine.instructions || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let medicine: Medicine;

    if (selectedMedicine) {
      if (medicineName !== selectedMedicine.medicineName) {
        const newMedicine = {
          medicineName,
          dosage,
          frequency,
          duration,
          instructions,
        };
        const createdMedicine = await createMedicineMutation.mutateAsync(
          newMedicine,
        );
        medicine = createdMedicine;
      } else {
        const updatedMedicine = {
          ...selectedMedicine,
          dosage,
          frequency,
          duration,
          instructions,
        };
        const updated = await updateMedicineMutation.mutateAsync(
          updatedMedicine,
        );
        medicine = updated;
      }
    } else {
      const newMedicine = {
        medicineName,
        dosage,
        frequency,
        duration,
        instructions,
      };
      const createdMedicine = await createMedicineMutation.mutateAsync(
        newMedicine,
      );
      medicine = createdMedicine;
    }

    await createVisitMedicineMutation.mutateAsync({
      visit,
      medicine,
    });

    onPrescriptionSubmit(medicine);

    setSelectedMedicine(null);
  };

  return (
    <div className="prescription-form">
      <h3>Create Prescription</h3>
      <form onSubmit={handleSubmit}>
        <SearchComponent<Medicine>
          data={storedMedicines}
          searchKey="medicineName"
          displayKey="medicineName"
          placeholder="Search for medicine..."
          onSelect={handleMedicineSelect}
        />

        <div className="medicine-details">
          <SearchComponent<Medicine>
            data={storedMedicines}
            searchKey="dosage"
            displayKey="dosage"
            placeholder={
              !!selectedMedicine ? selectedMedicine.dosage : "Dosage"
            }
            onSelect={(medicine) => setDosage(medicine.dosage)}
          />

          <SearchComponent<Medicine>
            data={storedMedicines}
            searchKey="frequency"
            displayKey="frequency"
            placeholder={
              !!selectedMedicine ? selectedMedicine.frequency : "Frequency"
            }
            onSelect={(medicine) => setFrequency(medicine.frequency)}
          />

          <input
            type="number"
            placeholder="Duration (days)"
            value={duration > 0 ? duration : ""}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />

          <SearchComponent<Medicine>
            data={storedMedicines}
            searchKey="instructions"
            displayKey="instructions"
            placeholder={
              !!selectedMedicine
                ? selectedMedicine.instructions
                : "Instructions"
            }
            onSelect={(medicine) =>
              setInstructions(medicine.instructions || "")
            }
          />
        </div>

        <button type="submit">
          {selectedMedicine
            ? medicineName !== selectedMedicine.medicineName
              ? "Add New Medicine to Prescription"
              : "Update and Add to Prescription"
            : "Add to Prescription"}
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;

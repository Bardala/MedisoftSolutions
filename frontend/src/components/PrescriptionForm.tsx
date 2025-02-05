import React, { useState } from "react";
import { Medicine, Visit } from "../types";
import {
  useGetAllMedicines,
  useCreateMedicine,
  useUpdateMedicine,
} from "../hooks/useMedicine";
import { useCreateVisitMedicine } from "../hooks/useVisitMedicine";
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

  // Handle medicine selection from the list
  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setMedicineName(medicine.medicineName);
    setDosage(medicine.dosage);
    setFrequency(medicine.frequency);
    setDuration(medicine.duration);
    setInstructions(medicine.instructions || "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let medicine: Medicine;

    if (selectedMedicine) {
      // Check if the medicineName has changed
      if (medicineName !== selectedMedicine.medicineName) {
        // If medicineName has changed, create a new medicine
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
        // If medicineName hasn't changed, update the existing medicine
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
      // If medicine doesn't exist, create a new one
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

    // Create a VisitMedicine record for the current visit
    await createVisitMedicineMutation.mutateAsync({
      visit,
      medicine,
    });

    // Notify the parent component
    onPrescriptionSubmit(medicine);

    // Reset form fields
    setMedicineName("");
    setDosage("");
    setFrequency("");
    setDuration(0);
    setInstructions("");
    setSelectedMedicine(null);
  };

  return (
    <div className="prescription-form">
      <h3>Create Prescription</h3>
      <form onSubmit={handleSubmit}>
        {/* Medicine Search and Selection */}
        <div className="medicine-search">
          <input
            type="text"
            placeholder="Search for medicine..."
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
          {storedMedicines && (
            <ul className="medicine-list">
              {storedMedicines
                .filter((medicine) =>
                  medicine.medicineName
                    .toLowerCase()
                    .includes(medicineName.toLowerCase()),
                )
                .map((medicine) => (
                  <li
                    key={medicine.id}
                    onClick={() => handleMedicineSelect(medicine)}
                  >
                    {medicine.medicineName} - {medicine.dosage}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Medicine Details */}
        <div className="medicine-details">
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
          />
          <input
            // type="number"
            placeholder="Duration (days)"
            value={duration > 0 ? duration : ""}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
          <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
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

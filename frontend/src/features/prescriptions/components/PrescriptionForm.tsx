import React, { useState } from "react";

import "@styles/prescriptionForm.css";
import "@styles/searchComponent.css";
import { useIntl } from "react-intl";
import {
  useGetAllMedicines,
  useCreateMedicine,
  useUpdateMedicine,
} from "@/features/medicines";
import { useCreateVisitMedicine } from "@/features/visits";
import { Visit, Medicine } from "@/shared";

interface PrescriptionFormProps {
  visit: Visit;
  onPrescriptionSubmit: (medicine: Medicine) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  visit,
  onPrescriptionSubmit,
}) => {
  const { formatMessage: f } = useIntl();
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [showDosageList, setShowDosageList] = useState(false);
  const [showFrequencyList, setShowFrequencyList] = useState(false);
  const [showInstructionsList, setShowInstructionsList] = useState(false);

  const { query: allMedicinesQuery } = useGetAllMedicines();
  const { createMutation: createMedicineMutation } = useCreateMedicine();
  const { updateMedicine, isLoading: isLoadingUpdatingMedicine } =
    useUpdateMedicine();
  const { createVM, isLoadingVM, errorVM, isErrorVM } =
    useCreateVisitMedicine();

  const isLoading =
    createMedicineMutation.isLoading ||
    isLoadingUpdatingMedicine ||
    isLoadingVM;

  const storedMedicines = allMedicinesQuery.data?.sort((a, b) =>
    a.medicineName.localeCompare(b.medicineName),
  ) as unknown as Medicine[];
  // Get unique values for suggestions
  const uniqueDosages = Array.from(
    new Set(storedMedicines?.map((m) => m.dosage) || []),
  );
  const uniqueFrequencies = Array.from(
    new Set(storedMedicines?.map((m) => m.frequency) || []),
  );
  const uniqueInstructions = Array.from(
    new Set(
      storedMedicines?.map((m) => m.instructions || "").filter((i) => i),
    ) || [],
  );

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

        try {
          const createdMedicine = await createMedicineMutation.mutateAsync(
            newMedicine,
          );
          medicine = createdMedicine;
        } catch (error) {
          console.error("Error: ", error);
        }
      } else {
        // If medicineName hasn't changed, update the existing medicine
        try {
          const updated = await updateMedicine.mutateAsync({
            medicineName: selectedMedicine.medicineName,
            dosage,
            frequency,
            duration,
            instructions,
          });
          medicine = updated;
        } catch (error) {
          console.error("Error: ", error);
        }
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
      try {
        const createdMedicine = await createMedicineMutation.mutateAsync(
          newMedicine,
        );
        medicine = createdMedicine;
      } catch (error) {
        console.error("Error: ", error);
      }
    }

    // Create a VisitMedicine record for the current visit
    try {
      await createVM({
        visitId: visit.id,
        medicineId: medicine.id,
      });
    } catch (err) {
      console.error("Error: ", err);
    }

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
      <h3>{f({ id: "createPrescription" })}</h3>
      {createMedicineMutation.isError && (
        <p className="error">{createMedicineMutation.error?.message}</p>
      )}
      {updateMedicine.isError && (
        <p className="error">{updateMedicine.error?.message}</p>
      )}
      {isErrorVM && <p className="error">{errorVM?.message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Medicine Search and Selection */}
        <div className="medicine-search">
          <input
            required
            type="text"
            placeholder={f({ id: "searchMedicine" })}
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
          {storedMedicines && (
            <ul className="search-list visible">
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
          <div className="search-container">
            <input
              required
              type="text"
              placeholder={f({ id: "dosage" })}
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              onFocus={() => setShowDosageList(true)}
              onBlur={() => setTimeout(() => setShowDosageList(false), 200)}
            />
            {showDosageList && (
              <ul className="search-list visible">
                {uniqueDosages && (
                  <ul className="medicine-list">
                    {uniqueDosages
                      .filter((d) =>
                        d.toLowerCase().includes(dosage.toLowerCase()),
                      )
                      .map((d, index) => (
                        <li key={index} onClick={(e) => setDosage(d)}>
                          {d}
                        </li>
                      ))}
                  </ul>
                )}
              </ul>
            )}
          </div>

          <div className="search-container">
            <input
              required
              type="text"
              placeholder={f({ id: "frequency" })}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              onFocus={() => setShowFrequencyList(true)}
              onBlur={() => setTimeout(() => setShowFrequencyList(false), 200)}
            />
            {showFrequencyList && (
              <ul className="search-list visible">
                {uniqueFrequencies && (
                  <ul className="medicine-list">
                    {uniqueFrequencies
                      .filter((f) =>
                        f.toLowerCase().includes(frequency.toLowerCase()),
                      )
                      .map((f, index) => (
                        <li key={index} onClick={() => setFrequency(f)}>
                          {f}
                        </li>
                      ))}
                  </ul>
                )}
              </ul>
            )}
          </div>
          <input
            // type="number"
            placeholder={f({ id: "duration" })}
            value={duration > 0 ? duration : ""}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />

          <div className="search-container">
            <textarea
              placeholder={f({ id: "instructions" })}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              onFocus={() => setShowInstructionsList(true)}
              onBlur={() =>
                setTimeout(() => setShowInstructionsList(false), 200)
              }
            />
            {showInstructionsList && (
              <ul className="search-list visible">
                {uniqueInstructions && (
                  <ul className="medicine-list">
                    {uniqueInstructions
                      .filter((inst) =>
                        inst.toLowerCase().includes(instructions.toLowerCase()),
                      )
                      .map((inst, index) => (
                        <li key={index} onClick={() => setInstructions(inst)}>
                          {inst}
                        </li>
                      ))}
                  </ul>
                )}
              </ul>
            )}
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {!!selectedMedicine
            ? medicineName === selectedMedicine.medicineName
              ? f({ id: "addToPrescription" })
              : f({ id: "updateMedicine" })
            : f({ id: "addNewMedicine" })}
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;

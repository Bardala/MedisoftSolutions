// @/features/home/hooks/useCurrentPatientCard.ts
import { useState, useEffect } from "react";
import { useDoctorSelection } from "@/features/clinic-management";
import { useFetchQueue } from "@/features/queue";
import { usePatientRegistry } from "@/features/patients";
import { analyzeVisits } from "@/utils";
import { Patient } from "@/shared/types";
import { VisitResDTO } from "@/dto";

export interface CurrentPatient extends Patient {
  currentVisit: VisitResDTO & { arrivedAt: string | null };
}

export const useCurrentPatientCard = () => {
  const { selectedDoctorId } = useDoctorSelection();
  const { queue, isLoading: queueLoading } = useFetchQueue(selectedDoctorId);
  const [currentPatient, setCurrentPatient] = useState<CurrentPatient>(null);
  const [lastVisit, setLastVisit] = useState<VisitResDTO>(null);

  const firstEntry = queue?.[0];
  const { patientRegistryQuery } = usePatientRegistry(firstEntry?.patientId);
  const patientRegistryData = patientRegistryQuery.data;

  useEffect(() => {
    if (patientRegistryData) {
      const {
        patient,
        visits,
        visitDentalProcedure,
        visitPayments,
        visitMedicines,
      } = patientRegistryData;

      if (patient) {
        const analyzedVisits = analyzeVisits(
          visits || [],
          visitDentalProcedure || [],
          visitPayments || [],
          visitMedicines || [],
        );

        const currentVisit = visits?.[visits.length - 1];
        const lastAnalyzedVisit =
          analyzedVisits?.length > 1
            ? analyzedVisits[analyzedVisits.length - 2]
            : null;

        setCurrentPatient({
          ...patient,
          currentVisit: {
            ...currentVisit,
            reason: currentVisit?.reason,
            arrivedAt: firstEntry?.createdAt
              ? new Date(firstEntry.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null,
          },
        });

        setLastVisit(lastAnalyzedVisit?.visit);
      } else {
        setCurrentPatient(null);
        setLastVisit(null);
      }
    }
  }, [patientRegistryData, firstEntry]);

  return {
    currentPatient,
    lastVisit,
    isLoading: queueLoading || patientRegistryQuery.isLoading,
    isError: patientRegistryQuery.isError,
  };
};

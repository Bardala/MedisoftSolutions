import { Patient } from "@/shared/types";
import { useMemo } from "react";

export const usePatientStatistics = (patients: Patient[] = []) => {
  return useMemo(() => {
    const validAges = patients
      .filter((p) => typeof p.age === "number")
      .map((p) => p.age);
    const totalPatients = patients.length;

    const averageAge =
      validAges.reduce((sum, age) => sum + age, 0) / (validAges.length || 1);

    const youngestAge = Math.min(...validAges);
    const oldestAge = Math.max(...validAges);

    const addressCounts: Record<string, number> = {};
    patients.forEach((p) => {
      const addr = p.address?.trim() || "Unknown";
      addressCounts[addr] = (addressCounts[addr] || 0) + 1;
    });

    const createdMonthly: Record<string, number> = {};
    patients.forEach((p) => {
      if (!p.createdAt) return;
      const date = new Date(p.createdAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      createdMonthly[monthKey] = (createdMonthly[monthKey] || 0) + 1;
    });

    return {
      totalPatients,
      averageAge: Math.round(averageAge),
      youngestAge,
      oldestAge,
      addressCounts,
      createdMonthly,
    };
  }, [patients]);
};

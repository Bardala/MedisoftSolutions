// src/components/PatientsCharts.tsx
import { FC } from "react";
import { useGetPatientStatistics } from "../hooks/usePatient";
import AddressDistributionChart from "@/features/charts/components/AddressDistributionChart";
import AgeDistributionChart from "@/features/charts/components/AgeDistributionChart";
import PatientRegistrationTrendChart from "@/features/charts/components/PatientRegistrationTrendChart";

const PatientsCharts: FC = () => {
  const { statistics, isLoading, error } = useGetPatientStatistics();

  if (isLoading) return <div>Loading charts...</div>;
  if (error) return <div>Error loading charts</div>;
  if (!statistics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <AgeDistributionChart statistics={statistics.ageDistribution} />
      <AddressDistributionChart statistics={statistics.addressDistribution} />
      <PatientRegistrationTrendChart
        statistics={statistics.registrationTrend}
      />
    </div>
  );
};

export default PatientsCharts;

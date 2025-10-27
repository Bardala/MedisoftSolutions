import { useGetDailyPayments } from "@/features/billing";
import { useGetDailyPatients } from "@/features/patients";
import { useGetDailyVisits } from "@/features/visits";
import { sortById } from "@/utils";

export const useDailyReportData = (
  date = new Date().toISOString().split("T")[0],
) => {
  const { dailyPaymentQuery } = useGetDailyPayments(date);
  const { dailyVisitsQuery } = useGetDailyVisits(date);
  const { dailyNewPatientsQuery } = useGetDailyPatients(date);

  const patients = sortById(dailyNewPatientsQuery.data);
  const visits = sortById(dailyVisitsQuery.data);
  const payments = sortById(dailyPaymentQuery.data);

  const totalPayments = payments?.reduce((acc, p) => acc + p.amount, 0);

  // Combined loading states
  const isLoadingBasic =
    dailyNewPatientsQuery.isLoading ||
    dailyPaymentQuery.isLoading ||
    dailyVisitsQuery.isLoading;

  return {
    patients,
    visits,
    payments,
    totalPayments,
    isLoading: isLoadingBasic,
    isError:
      dailyNewPatientsQuery.isError ||
      dailyPaymentQuery.isError ||
      dailyVisitsQuery.isError,
  };
};

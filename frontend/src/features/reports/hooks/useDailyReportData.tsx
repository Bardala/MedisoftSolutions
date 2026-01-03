import { useLogin } from "@/app";
import { useGetDailyPayments } from "@/features/billing";
import { useGetDailyPatients } from "@/features/patients";
import { useGetDailyVisits } from "@/features/visits";
import { isNotDoctorRole } from "@/shared";
import { sortById } from "@/utils";

export const useDailyReportData = (
  date = new Date().toISOString().split("T")[0],
) => {
  const { loggedInUser } = useLogin();
  const { dailyPaymentQuery } = useGetDailyPayments(date);
  const { dailyVisitsQuery } = useGetDailyVisits(date);
  const { dailyNewPatientsQuery } = useGetDailyPatients(date);

  const patients = sortById(dailyNewPatientsQuery.data);
  const visits = sortById(dailyVisitsQuery.data);
  const payments = sortById(dailyPaymentQuery.data);

  const totalPayments = payments?.reduce((acc, p) => acc + p.amount, 0);

  // Combined loading states
  const isLoadingBasic =
    (isNotDoctorRole(loggedInUser.role)
      ? dailyNewPatientsQuery.isLoading
      : false) ||
    dailyPaymentQuery.isLoading ||
    dailyVisitsQuery.isLoading;

  return {
    patients,
    visits,
    payments,
    totalPayments,
    isLoading: isLoadingBasic,
    isError:
      (isNotDoctorRole(loggedInUser.role)
        ? dailyNewPatientsQuery.isError
        : false) ||
      dailyPaymentQuery.isError ||
      dailyVisitsQuery.isError,
  };
};

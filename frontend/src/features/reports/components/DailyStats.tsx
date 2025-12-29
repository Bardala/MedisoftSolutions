import { FC } from "react";
import { useIntl } from "react-intl";
import { useDailyReportData } from "../hooks";

interface DailyStatsProps {
  selectedDate?: string;
}

//? the same data is fetched in DailyFinancialReport
export const DailyStats: FC<DailyStatsProps> = ({ selectedDate }) => {
  const { formatMessage: f } = useIntl();
  const { patients, visits, payments, totalPayments } =
    useDailyReportData(selectedDate);

  return (
    <div className="stats">
      <p>
        {f({ id: "totalRevenue" })}:{" "}
        <strong>
          {totalPayments || 0} {f({ id: "L.E" })}
        </strong>
      </p>
      <p>
        {f({ id: "totalPayments" })}: <strong>{payments?.length || 0}</strong>
      </p>
      <p>
        {f({ id: "totalVisits" })}: <strong>{visits?.length || 0}</strong>
      </p>
      <p>
        {f({ id: "newPatients" })}: <strong>{patients?.length || 0}</strong>
      </p>
    </div>
  );
};

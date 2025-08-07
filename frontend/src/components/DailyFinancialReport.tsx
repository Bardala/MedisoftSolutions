/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDailyReportData } from "../hooks/useDailyReportData";
import "../styles/financialComponents.css";
import {
  linkVisitsAndPayments,
  VisitWithPayment,
} from "../utils/linkVisitPayment";
import { dailyTimeFormate, timeFormate } from "../utils";
import Table, { Column } from "./Table";
import {
  faExchangeAlt,
  faCalendarAlt,
  faFileArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useUpdatePayment, useDeletePayment } from "../hooks/usePayment";
import { useDeleteVisit, useUpdateVisit } from "../hooks/useVisit";
import { useLogin } from "../context/loginContext";
import { useIntl } from "react-intl";
import { DailyReportCharts } from "./DailyReportChart";
import { ToggleStatsData } from "./ToggleStatsData";
import { isOwnerRole } from "../types";
import { useNavToPatient } from "../hooks/useNavToPatient";
import { PatientResDTO, PaymentResDTO } from "../dto";
import { useParams } from "react-router-dom";

const DailyFinancialReport = () => {
  const date = useParams().date;
  const navToPatient = useNavToPatient();
  const { formatMessage: f } = useIntl();
  const [convertPaymentTable, setConvertPaymentTable] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    date ?? new Date().toISOString().split("T")[0],
  ); // Default: Today
  const { loggedInUser } = useLogin();

  const { deleteVisitMutation } = useDeleteVisit();
  const { updatePaymentMutation } = useUpdatePayment();
  const { deletePaymentMutation } = useDeletePayment();
  const [showStats, setShowStats] = useState(false);
  const { updateVisitMutation } = useUpdateVisit();

  // Fetch data for the selected date
  const { patients, visits, payments, totalPayments, isError, isLoading } =
    useDailyReportData(selectedDate);

  if (isLoading) return <p>{f({ id: "loading" })}</p>;
  if (isError) return <p>{f({ id: "errorLoadingData" })}</p>;

  const { linked: linkedVisits, unlinkedPayments } = linkVisitsAndPayments(
    visits || [],
    payments || [],
  );

  const linkedVisitColumns: Column<any>[] = [
    {
      header: f({ id: "patientName" }),
      accessor: (row: VisitWithPayment) => row?.patientName,
      clickable: () => true,
      onClick: (row: VisitWithPayment) => navToPatient(row?.patientId),
    },
    {
      header: f({ id: "phone" }),
      accessor: (row: VisitWithPayment) => row?.patientPhone,
      expandable: true,
    },
    {
      header: f({ id: "doctorName" }),
      accessor: (row: VisitWithPayment) => row?.doctorName,
      expandable: true,
    },
    {
      header: f({ id: "visitNotes" }),
      accessor: (row: VisitWithPayment) => row?.doctorNotes,
      expandable: true,
    },
    {
      header: f({ id: "amountPaid" }),
      accessor: (row) => `${row?.amountPaid} ${f({ id: "L.E" })}`,
    },
    {
      header: f({ id: "registrationTime" }),
      accessor: (row: VisitWithPayment) => dailyTimeFormate(row?.createdAt),
    },
    {
      header: f({ id: "visitReason" }),
      accessor: (row: VisitWithPayment) =>
        row?.reason || f({ id: "not_available" }),
    },
    {
      header: f({ id: "visitScheduledTime" }),
      accessor: (row: VisitWithPayment) =>
        row?.scheduledTime && timeFormate(row.scheduledTime),

      expandable: true,
    },
  ];

  const paymentColumns: Column<any>[] = [
    {
      header: f({ id: "patientName" }),
      accessor: (row) => row?.patientName,
      clickable: () => true,
      onClick: (row: PaymentResDTO) => navToPatient(row?.patientId),
    },
    {
      header: f({ id: "amountPaid" }),
      accessor: (row) => `${row?.amount} ${f({ id: "L.E" })}`,
    },
    {
      header: f({ id: "registeredAt" }),
      accessor: (row) => dailyTimeFormate(row.createdAt),
    },
    {
      header: f({ id: "recordedBy" }),
      accessor: (row) => row.recordedByName,
      expandable: true,
    },
    {
      header: f({ id: "time" }),
      accessor: (row) => timeFormate(row.createdAt),
      expandable: true,
    },
  ];

  const patientColumns: Column<any>[] = [
    {
      header: f({ id: "patientName" }),
      accessor: (row) => row.fullName,
      clickable: () => true,
      onClick: (row: PatientResDTO) => navToPatient(row?.id),
    },
    { header: f({ id: "phone" }), accessor: "phone", expandable: true },
    {
      header: f({ id: "patientAge" }),
      accessor: (row) => row.age,
      expandable: true,
    },
    {
      header: f({ id: "patientAddress" }),
      accessor: (row) => row?.address || f({ id: "not_available" }),
    },
    {
      header: f({ id: "medicalHistory" }),
      accessor: (row) => row?.medicalHistory,
      expandable: true,
    },
    {
      header: f({ id: "notes" }),
      accessor: (row) => row?.notes,
      expandable: true,
    },
    {
      header: f({ id: "registeredAt" }),
      accessor: (row) => dailyTimeFormate(row?.createdAt),
    },
  ];

  return (
    <div className="card-container">
      {/* <h2>{f({ id: "dailyReport" })}</h2> */}
      <ToggleStatsData
        header={f({ id: "dailyReports" })}
        dataIcon={faFileArchive}
        showStats={showStats}
        setShowStats={setShowStats}
      />

      {/* Date Picker */}
      {isOwnerRole(loggedInUser.role) && (
        <div className="date-picker-container">
          <label htmlFor="report-date">
            <FontAwesomeIcon icon={faCalendarAlt} /> {f({ id: "selectDate" })}:
          </label>
          <input
            type="date"
            id="report-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        </div>
      )}

      {showStats ? (
        <DailyReportCharts date={selectedDate} />
      ) : (
        <>
          <div className="stats">
            <p>
              {f({ id: "totalRevenue" })}:{" "}
              <strong>
                {totalPayments || 0} {f({ id: "L.E" })}
              </strong>
            </p>
            <p>
              {f({ id: "totalPayments" })}:{" "}
              <strong>{payments?.length || 0}</strong>
            </p>
            <p>
              {f({ id: "totalVisits" })}: <strong>{visits?.length || 0}</strong>
            </p>
            <p>
              {f({ id: "newPatients" })}:{" "}
              <strong>{patients?.length || 0}</strong>
            </p>
          </div>

          <div className="tables">
            <div className="visits-section">
              <h3>{f({ id: "dailyVisits" })}</h3>
              <Table
                columns={linkedVisitColumns}
                data={linkedVisits}
                onDelete={deleteVisitMutation.mutate}
                onUpdate={updateVisitMutation.mutate}
                enableActions={true}
              />
            </div>

            <div className="payment-section">
              {/* Header for Table */}
              <div className="payment-header-container">
                <h3>
                  {convertPaymentTable
                    ? f({ id: "allPayments" })
                    : f({ id: "unlinkedPayments" })}
                </h3>
                <button
                  onClick={() => setConvertPaymentTable(!convertPaymentTable)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </button>
              </div>

              {/* Toggle Between Tables */}
              {convertPaymentTable ? (
                <Table
                  columns={paymentColumns}
                  data={payments}
                  onUpdate={updatePaymentMutation.mutate}
                  onDelete={deletePaymentMutation.mutate}
                  enableActions={true}
                />
              ) : (
                <>
                  {updatePaymentMutation.isError && (
                    <p className="error">
                      {updatePaymentMutation?.error?.message}
                    </p>
                  )}
                  <Table
                    columns={paymentColumns}
                    data={unlinkedPayments}
                    onUpdate={updatePaymentMutation.mutate}
                    onDelete={deletePaymentMutation.mutate}
                    enableActions={true}
                  />
                </>
              )}
            </div>

            <div className="new-patients-section">
              <h3>{f({ id: "dailyNewPatients" })}</h3>
              <Table
                columns={patientColumns}
                data={patients || []}
                enableActions={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyFinancialReport;

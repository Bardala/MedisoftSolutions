import { useDailyReportData } from "../hooks/useDailyReportData";
import "../styles/financialComponents.css";
import { linkVisitsAndPayments } from "../utils/linkVisitPayment";
import { dailyTimeFormate, timeFormate } from "../utils";
import Table from "./Table";
import {
  faExchangeAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useUpdatePayment, useDeletePayment } from "../hooks/usePayment";
import { useDeleteVisit } from "../hooks/useVisit";

const DailyFinancialReport = () => {
  const [convertPaymentTable, setConvertPaymentTable] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  ); // Default: Today

  const { deleteVisitMutation } = useDeleteVisit();
  const { updatePaymentMutation } = useUpdatePayment();
  const { deletePaymentMutation } = useDeletePayment();

  // Fetch data for the selected date
  const { patients, visits, payments, totalPayments, isError, isLoading } =
    useDailyReportData(selectedDate);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data. Please try again later.</p>;

  const { linked: linkedVisits, unlinkedPayments } = linkVisitsAndPayments(
    visits || [],
    payments || [],
  );

  const linkedVisitColumns = [
    { header: "Visit Id", accessor: (row) => row.id },
    { header: "Patient Name", accessor: (row) => row?.patient.fullName },
    {
      header: "Phone",
      accessor: (row) => row?.patient.phone,
      expandable: true,
    },
    {
      header: "Doctor Notes",
      accessor: (row) => row?.doctorNotes || "N/A",
      expandable: true,
    },
    { header: "Amount Paid", accessor: (row) => `$${row?.amountPaid}` },
    {
      header: "Visit Time",
      accessor: (row) => dailyTimeFormate(row?.createdAt),
    },
  ];

  const paymentColumns = [
    { header: "Payment Id", accessor: (row) => row?.id },
    { header: "Patient Name", accessor: (row) => row?.patient.fullName },
    { header: "Amount", accessor: (row) => `$${row?.amount}` },
    { header: "Date", accessor: (row) => dailyTimeFormate(row.createdAt) },
    {
      header: "Recorded By",
      accessor: (row) => row.recordedBy.name,
      expandable: true,
    },
    {
      header: "Time",
      accessor: (row) => timeFormate(row.createdAt),
      expandable: true,
    },
  ];

  const patientColumns = [
    { header: "Id", accessor: "id" },
    { header: "Patient Name", accessor: "fullName" },
    { header: "Phone", accessor: "phone", expandable: true },
    { header: "Age", accessor: "age", expandable: true },
    { header: "Address", accessor: (row) => row?.address || "N/A" },
    {
      header: "Medical History",
      accessor: (row) => row?.medicalHistory || "N/A",
      expandable: true,
    },
    {
      header: "Notes",
      accessor: (row) => row?.notes || "N/A",
      expandable: true,
    },
    {
      header: "Registered At",
      accessor: (row) => dailyTimeFormate(row?.createdAt),
    },
  ];

  return (
    <div className="card-container">
      <h2>Daily Report</h2>

      {/* Date Picker */}
      <div className="date-picker-container">
        <label htmlFor="report-date">
          <FontAwesomeIcon icon={faCalendarAlt} /> Select Date:
        </label>
        <input
          type="date"
          id="report-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>

      <div className="stats">
        <p>
          Total Revenue: <strong>${totalPayments || 0}</strong>
        </p>
        <p>
          Total Payments: <strong>{payments?.length || 0}</strong>
        </p>
        <p>
          Total Visits: <strong>{visits?.length || 0}</strong>
        </p>
        <p>
          New Patients: <strong>{patients?.length || 0}</strong>
        </p>
      </div>

      <div className="tables">
        <div className="visits-section">
          <h3>Daily Visits</h3>
          <Table
            columns={linkedVisitColumns}
            data={linkedVisits}
            onDelete={deleteVisitMutation.mutate}
            enableActions={true}
          />
        </div>

        <div className="payment-section">
          {/* Header for Table */}
          <div className="payment-header-container">
            <h3>
              {convertPaymentTable ? "All Payments" : "Unlinked Payments"}
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
            <Table
              columns={paymentColumns}
              data={unlinkedPayments}
              onUpdate={updatePaymentMutation.mutate}
              onDelete={deletePaymentMutation.mutate}
              enableActions={true}
            />
          )}
        </div>

        <div className="new-patients-section">
          <h3>Daily New Patients</h3>
          <Table columns={patientColumns} data={patients || []} />
        </div>
      </div>
    </div>
  );
};

export default DailyFinancialReport;

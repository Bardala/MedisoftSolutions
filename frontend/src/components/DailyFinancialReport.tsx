import { useDailyReportData } from "../hooks/useDailyReportData";
import "../styles/financialComponents.css";
import { linkVisitsAndPayments } from "../utils/linkVisitPayment";
import { dailyTimeFormate } from "../utils";
import Table from "./Table";

const DailyFinancialReport = () => {
  const { patients, visits, payments, paymentsSummary, isError, isLoading } =
    useDailyReportData();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data. Please try again later.</p>;

  const { linked: linkedVisits, unlinkedPayments } = linkVisitsAndPayments(
    visits || [],
    payments || [],
  );

  const linkedVisitColumns = [
    { header: "Patient Name", accessor: (row) => row?.patient.fullName },
    { header: "Phone", accessor: (row) => row?.patient.phone },
    { header: "Doctor Notes", accessor: (row) => row?.doctorNotes || "N/A" },
    {
      header: "Visit Time",
      accessor: (row) => dailyTimeFormate(row?.createdAt),
    },
    { header: "Amount Paid", accessor: (row) => `$${row?.amountPaid}` },
  ];

  const unlinkedPaymentColumns = [
    { header: "Patient Name", accessor: (row) => row?.patient.fullName },
    { header: "Phone", accessor: (row) => row?.patient.phone },
    { header: "Amount Paid", accessor: (row) => `$${row?.amount}` },
    { header: "Time", accessor: (row) => dailyTimeFormate(row?.createdAt) },
  ];

  const patientColumns = [
    { header: "Id", accessor: "id" },
    { header: "Patient Name", accessor: "fullName" },
    { header: "Phone", accessor: "phone" },
    { header: "Age", accessor: "age" },
    { header: "Address", accessor: "address" },
    { header: "Medical History", accessor: "medicalHistory" },
    { header: "Notes", accessor: (row) => row?.notes || "N/A" },
    {
      header: "Registered At",
      accessor: (row) => dailyTimeFormate(row?.createdAt),
    },
  ];

  return (
    <div className="card-container">
      <h2>Daily Report</h2>

      <div className="stats">
        <p>Total Daily Revenue: ${paymentsSummary?.paymentCalc || 0}</p>
        <p>Total Daily Payments: {paymentsSummary?.paymentNum || 0}</p>
        <p>Total Visits: {visits?.length || 0}</p>
        <p>Total New Patients: {patients?.length || 0}</p>
      </div>

      <div className="tables">
        <div className="table-container">
          <h3>Daily Visits</h3>
          <Table columns={linkedVisitColumns} data={linkedVisits} />
        </div>

        {unlinkedPayments.length > 0 && (
          <div className="table-container">
            <h3>Unlinked Payments</h3>
            <Table columns={unlinkedPaymentColumns} data={unlinkedPayments} />
          </div>
        )}

        <div className="table-container">
          <h3>Daily New Patients</h3>
          <Table columns={patientColumns} data={patients || []} />
        </div>
      </div>
    </div>
  );
};

export default DailyFinancialReport;

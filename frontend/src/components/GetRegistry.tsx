import { FC, useState } from "react";
import PatientSearch from "./PatientSearch";
import { usePatientSearch } from "../hooks/usePatientSearch";
import { usePatientRegistry } from "../hooks/useRegistry";
import { findUnlinkedPayments } from "../utils/visitAnalysis";
import Table from "./Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  monthlyTimeFormate,
  timeFormate,
  yearlyTimeFormate,
} from "../utils/timeFormat";
import "../styles/getRegistry.css";
import UserFiles from "./UserFiles";
import { useUpdatePatient } from "../hooks/usePatient";
import { sortById } from "../utils/sort";
import { useLogin } from "../context/loginContext";
import { useIntl } from "react-intl";
import { PatientInfo } from "./PatientInfo";
import { VisitTable } from "./VisitTable";

export const GetRegistry: FC = () => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const { handlePatientSelect, selectedPatient, allPatients } =
    usePatientSearch();
  const [patientId, setPatientId] = useState<number | null>(null);
  const { patientRegistryQuery } = usePatientRegistry(patientId);
  const { data, isLoading, error } = patientRegistryQuery;

  const [convertPaymentTable, setConvertPaymentTable] = useState(false);

  const { updatePatientMutation } = useUpdatePatient();

  const handleSubmit = () =>
    selectedPatient && setPatientId(selectedPatient.id);

  const allPatientColumns = [
    {
      header: f({ id: "id" }),
      accessor: (row) => row.id,
    },
    {
      header: f({ id: "full_name" }),
      accessor: (row) => row.fullName,
    },
    {
      header: f({ id: "address" }),
      accessor: (row) => row.address || f({ id: "not_available" }),
    },
    {
      header: f({ id: "age" }),
      accessor: (row) => row.age || f({ id: "not_available" }),
    },
    {
      header: f({ id: "phone_number" }),
      accessor: (row) => row.phone,
      expandable: true,
    },
    {
      header: f({ id: "registered_at" }),
      accessor: (row) => timeFormate(row.createdAt),
      expandable: true,
    },
    {
      header: f({ id: "medical_history" }),
      accessor: (row) => row.medicalHistory || f({ id: "not_available" }),
      expandable: true,
    },
  ];

  const paymentColumns = [
    {
      header: f({ id: "payment_id" }),
      accessor: (row) => row?.id,
    },
    {
      header: f({ id: "amount" }),
      accessor: (row) => `$${row?.amount}`,
    },
    {
      header: f({ id: "date" }),
      accessor: (row) => monthlyTimeFormate(row.createdAt),
    },
    {
      header: f({ id: "recorded_by" }),
      accessor: (row) => row.recordedBy.name,
      expandable: true,
    },
    {
      header: f({ id: "year" }),
      accessor: (row) => yearlyTimeFormate(row.createdAt),
      expandable: true,
    },
  ];

  return (
    <div className="container">
      <h1>{f({ id: "patient_registry" })}</h1>
      <PatientSearch onSelect={handlePatientSelect} />
      <button
        className="search-button"
        onClick={handleSubmit}
        disabled={!selectedPatient}
      >
        <FontAwesomeIcon icon={faSearch} /> {selectedPatient?.fullName}
      </button>

      {!!patientId && isLoading && (
        <p>{f({ id: "loading_patient_registry" })}</p>
      )}
      {error && (
        <p>
          {f(
            { id: "error_loading_patient_registry" },
            { error: error.message },
          )}
        </p>
      )}

      {data && (
        <div>
          {/* Patient Details */}
          <PatientInfo
            patient={data.patient}
            visits={data.visits}
            payments={data.payments}
          />

          {/* Visits Section */}
          <VisitTable patientId={patientId} showVisits="All" />
          {/* Unlinked Payments Section */}
          <div>
            {/* Header for Table */}
            <div className="payment-header-container">
              <h4 className="payment-header">
                {convertPaymentTable
                  ? f({ id: "all_payments" })
                  : f({ id: "unlinked_payments" })}
              </h4>
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
                data={sortById(data.payments)}
                enableActions={true}
              />
            ) : (
              <Table
                columns={paymentColumns}
                data={findUnlinkedPayments(
                  sortById(data.payments),
                  data.visitPayments,
                )}
                enableActions={true}
              />
            )}
          </div>

          <UserFiles patientId={patientId} />
        </div>
      )}

      {!selectedPatient && allPatients?.length > 0 && (
        <Table
          columns={allPatientColumns}
          data={allPatients.sort(
            (p1, p2) => p1.fullName.charCodeAt(0) - p2.fullName.charCodeAt(0),
          )}
          enableActions={true}
          onUpdate={
            loggedInUser.role === "Doctor"
              ? updatePatientMutation.mutate
              : undefined
          }
        />
      )}
    </div>
  );
};

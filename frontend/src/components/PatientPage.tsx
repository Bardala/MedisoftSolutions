import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { usePatientRegistry } from "../hooks/useRegistry";
import {
  monthlyTimeFormate,
  yearlyTimeFormate,
  translateErrorMessage,
  sortById,
  findUnlinkedPayments,
} from "../utils";
import { PatientCharts } from "./PatientCharts";
import { PatientInfo } from "./PatientInfo";
import Table from "./Table";
import UserFiles from "./UserFiles";
import { VisitTable } from "./VisitTable";

interface PatientPageProps {
  patientId: number;
}

export const PatientPage: FC<PatientPageProps> = ({ patientId }) => {
  const { formatMessage: f, locale } = useIntl();

  const { patientRegistryQuery } = usePatientRegistry(patientId);
  const { data, isLoading, error } = patientRegistryQuery;

  const [convertPaymentTable, setConvertPaymentTable] = useState(false);

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
    <>
      {/* Patient profile page */}
      {data && (
        <div>
          {!!patientId && isLoading && (
            <p>{f({ id: "loading_patient_registry" })}</p>
          )}
          {error && (
            <p className="error">
              {f(
                { id: "error_loading_patient_registry" },
                { error: translateErrorMessage(error.message, locale) },
              )}
            </p>
          )}

          <PatientInfo patientRegistry={data} />

          {/* <PatientCharts
            payments={data?.payments}
            visits={data?.visits}
            visitDentalProcedures={data?.visitDentalProcedure}
          /> */}

          <VisitTable patientId={patientId} showVisits="All" />

          <div>
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
    </>
  );
};

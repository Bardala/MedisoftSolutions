import { faExchangeAlt, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { usePatientRegistry } from "../hooks/useRegistry";
import {
  monthlyTimeFormate,
  yearlyTimeFormate,
  translateErrorMessage,
  sortById,
  findUnlinkedPayments,
} from "../utils";
import { PatientInfo } from "./PatientInfo";
import Table from "./Table";
import UserFiles from "./UserFiles";
import { VisitTable } from "./VisitTable";
import { useReactToPrint } from "react-to-print";
import { useLogin } from "../context/loginContext";
import { isDoctorRole } from "../types";
import { useParams } from "react-router-dom";

interface PatientPageProps {
  patientId?: number;
}

export const PatientPage: FC<PatientPageProps> = ({ patientId }) => {
  const { id } = useParams();
  patientId = patientId || (id ? parseInt(id, 10) : null);

  const { formatMessage: f, locale } = useIntl();
  const { loggedInUser } = useLogin();

  const { patientRegistryQuery } = usePatientRegistry(patientId);
  const { data, isLoading, error } = patientRegistryQuery;

  const [convertPaymentTable, setConvertPaymentTable] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
        @page { size: A4; margin: 10mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `,
    documentTitle: `Patient_Details_${patientId}`,
  });

  const paymentColumns = [
    {
      header: f({ id: "amount" }),
      accessor: (row) => `${row?.amount} ${f({ id: "L.E" })}`,
    },
    {
      header: f({ id: "date" }),
      accessor: (row) => monthlyTimeFormate(row.createdAt),
    },
    {
      header: f({ id: "recorded_by" }),
      accessor: (row) => row.recordedByName,
    },
    {
      header: f({ id: "year" }),
      accessor: (row) => yearlyTimeFormate(row.createdAt),
      // expandable: true,
    },
  ];

  if (!patientId) {
    return <p>{f({ id: "no_patient_selected" })}</p>;
  }

  return (
    <>
      {/* Patient profile page */}
      {data && (
        <div ref={componentRef} className="patient-page-container">
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

          {/* <PatientProfilePage patientId={patientId} /> */}

          <PatientInfo patientRegistry={data} />

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

      {isDoctorRole(loggedInUser.role) && (
        <div className="print-button-container no-print">
          <button onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      )}
    </>
  );
};

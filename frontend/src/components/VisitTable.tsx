import { useIntl } from "react-intl";
import { usePatientRegistry } from "../hooks/useRegistry";
import { Visit, Payment, Procedure } from "../types";
import { monthlyTimeFormate, yearlyTimeFormate, analyzeVisits } from "../utils";
import { sortById } from "../utils/sort";
import Table from "./Table";
import { useState } from "react";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface VisitTableProp {
  patientId: number;
  showVisits: "All" | "Rest";
}

export const VisitTable = ({ patientId, showVisits }: VisitTableProp) => {
  const { formatMessage: f } = useIntl();
  const { patientRegistryQuery } = usePatientRegistry(patientId);
  const { data, isLoading, error } = patientRegistryQuery;
  const [showTable, setShowTable] = useState(false);

  const visitColumns = [
    {
      header: f({ id: "payment" }),
      accessor: (row: { payment: Payment }) =>
        row.payment
          ? `${row.payment.amount} ${f({ id: "L.E" })}`
          : f({ id: "not_available" }),
    },
    {
      header: f({ id: "date" }),
      accessor: (row: { visit: Visit }) =>
        monthlyTimeFormate(row.visit.createdAt),
    },
    {
      header: f({ id: "notes" }),
      accessor: (row: { visit: Visit }) =>
        row.visit.doctorNotes || f({ id: "not_available" }),
      // expandable: true,
    },
    {
      header: f({ id: "procedures" }),
      accessor: (row: { procedures: Procedure[] }) =>
        row.procedures
          ?.map(
            (procedure: Procedure) =>
              procedure.serviceName + " " + procedure.arabicName,
          )
          .join(", ") || f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "medicines" }),
      accessor: (row) =>
        row.medicines?.map((medicine) => medicine.medicineName).join(", ") ||
        f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "year" }),
      accessor: (row: { visit: Visit }) =>
        yearlyTimeFormate(row.visit.createdAt),
      expandable: true,
    },
  ];

  const visits = analyzeVisits(
    sortById(data.visits),
    data.visitDentalProcedure,
    data.visitPayments,
    data.visitMedicines,
  );

  if (isLoading) return <p>{f({ id: "loading" })}</p>;
  if (error) return <p>{f({ id: "error" })}</p>;

  return showVisits === "All" ? (
    <>
      <h3>{f({ id: "visits" })}</h3>

      {visits.length > 0 ? (
        <Table columns={visitColumns} data={visits} enableActions={true} />
      ) : (
        <span>{f({ id: "there_is_no_visits_yet" })}</span>
      )}
    </>
  ) : visits.length > 2 ? (
    <>
      <div className="visit-card">
        <div
          className="visit-card-header"
          onClick={() => setShowTable(!showTable)}
        >
          <h3 className="visit-card-title">{f({ id: "rest_of_visits" })}</h3>
          <FontAwesomeIcon
            icon={showTable ? faChevronUp : faChevronDown}
            className="toggle-icon"
          />
        </div>

        {showTable && (
          <Table
            columns={visitColumns}
            data={visits.length > 2 ? visits.slice(2) : null}
            enableActions={true}
          />
        )}
      </div>
    </>
  ) : (
    <span>{f({ id: "there_is_no_older_visits" })}</span>
  );
};

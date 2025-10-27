import { Table } from "@/shared";
import { Clinic } from "@/shared/types";
import { useIntl } from "react-intl";

interface ClinicTableProps {
  clinics: Clinic[];
}

const ClinicsTable = ({ clinics }: ClinicTableProps) => {
  const { formatMessage: f } = useIntl();

  const clinicColumns = [
    {
      header: f({ id: "id" }),
      accessor: (row) => row.id || f({ id: "not_available" }),
    },
    {
      header: f({ id: "name" }),
      accessor: (row) => row.name || f({ id: "not_available" }),
    },
    {
      header: f({ id: "address" }),
      accessor: (row) => row.address || f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "phone" }),
      accessor: (row) => row.phoneNumber || f({ id: "not_available" }),
    },
    {
      header: f({ id: "email" }),
      accessor: (row) => row.email || f({ id: "not_available" }),
      expandable: true,
    },
    {
      header: f({ id: "doctors_count" }),
      accessor: (row) => row.doctors?.length || 0,
      expandable: true,
    },
    {
      header: f({ id: "date" }),
      accessor: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : f({ id: "not_available" }),
      expandable: true,
    },
  ];

  return (
    <div className="clinics-tables-container">
      <div className="clinic-details-table">
        <h3>{f({ id: "clinic_details" })}</h3>
        {clinics.length > 0 ? (
          <Table columns={clinicColumns} data={clinics} enableActions={true} />
        ) : (
          <span>{f({ id: "no_clinics_found" })}</span>
        )}
      </div>
    </div>
  );
};

export default ClinicsTable;

import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { PatientResDTO } from "@/dto";
import { ToggleStatsData } from "@/features/reports";
import { Table, timeFormate } from "@/shared";
import { useNavToPatient, usePatientSearch } from "../hooks";
import PatientsCharts from "./PatientsCharts";

const PatientsTable = () => {
  const { formatMessage: f } = useIntl();
  const navToPatient = useNavToPatient();

  const { patients, error, setShowAllPatients, pagination, isLoading } =
    usePatientSearch();
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    setShowAllPatients(true);
  });

  const allPatientColumns = [
    {
      header: f({ id: "full_name" }),
      accessor: (row: PatientResDTO) => row.fullName,
      clickable: () => true,
      onClick: (row) => navToPatient(row.id),
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
      accessor: (row) => row.medicalHistory,
      expandable: true,
    },
  ];

  return (
    <>
      {isLoading && <p>{f({ id: "loading_patients" })}</p>}
      {patients.length > 0 && (
        <>
          {error && (
            <p>
              {f(
                { id: "error_loading_patient_registry" },
                { error: error.message },
              )}
            </p>
          )}

          <ToggleStatsData
            header={""}
            setShowStats={setShowStats}
            showStats={showStats}
            dataIcon={faTable}
          />
          {showStats ? (
            <PatientsCharts />
          ) : (
            <>
              <Table
                columns={allPatientColumns}
                data={patients.sort((p1, p2) =>
                  p1.fullName.localeCompare(p2.fullName),
                )}
                enableActions={true}
                // onUpdate={
                //   isDoctorRole(loggedInUser.role)
                //     ? updatePatientMutation.mutateAsync
                //     : undefined
                // }
              />

              <div className="pagination-buttons">
                <button
                  disabled={pagination.currentPage === 0}
                  onClick={() => pagination.setPage(pagination.currentPage - 1)}
                >
                  {f({ id: "last_page" })}
                </button>

                <button
                  disabled={!pagination.hasMore}
                  onClick={() => pagination.setPage(pagination.currentPage + 1)}
                >
                  {f({ id: "next_page" })}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default PatientsTable;

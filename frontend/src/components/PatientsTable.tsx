import { useIntl } from "react-intl";
import { useLogin } from "../context/loginContext";
import { useUpdatePatient } from "../hooks/usePatient";
import { usePatientSearch } from "../hooks/usePatient";
import { timeFormate } from "../utils";
import { PatientsCharts } from "./PatientsCharts";
import Table from "./Table";
import { useEffect, useState } from "react";
import { ToggleStatsData } from "./ToggleStatsData";
import { faTable } from "@fortawesome/free-solid-svg-icons";

export const PatientsTable = () => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const { updatePatientMutation } = useUpdatePatient();
  const { patients, error, setShowAllPatients, pagination, isLoading } =
    usePatientSearch();
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    setShowAllPatients(true);
  });

  const allPatientColumns = [
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
            <PatientsCharts patients={patients} />
          ) : (
            <>
              <Table
                columns={allPatientColumns}
                data={patients.sort((p1, p2) =>
                  p1.fullName.localeCompare(p2.fullName),
                )}
                enableActions={true}
                onUpdate={
                  loggedInUser.role === "Doctor"
                    ? updatePatientMutation.mutate
                    : undefined
                }
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

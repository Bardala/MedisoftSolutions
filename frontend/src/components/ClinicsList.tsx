import { useIntl } from "react-intl";
import { useState } from "react";
import { useGetClinics } from "../hooks/useClinic";
import { ClinicSearchReq } from "../types";
import { ClinicSearchForm } from "./ClinicSearchForm";
import { Pagination } from "./Pagination";
import { ClinicData } from "./ClinicData";

export const ClinicsList = () => {
  const { formatMessage: f } = useIntl();
  const [searchParams, setSearchParams] = useState<ClinicSearchReq>({
    page: 0,
    size: 10,
  });
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);

  const {
    data: clinicsPage,
    isLoading,
    isPreviousData,
  } = useGetClinics(searchParams);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleClinicSelect = (clinicId: number) => {
    setSelectedClinicId(clinicId);
  };

  if (isLoading) return <div>{f({ id: "loading" })}</div>;

  if (selectedClinicId) {
    return <ClinicData clinicId={selectedClinicId} />;
  }

  return (
    <div className="clinics-page">
      <div className="clinics-header">
        <h2>{f({ id: "all_clinics" })}</h2>
        <ClinicSearchForm
          onSearch={(filters) =>
            setSearchParams({ ...filters, page: 0, size: searchParams.size })
          }
        />
      </div>

      <div className="clinics-results">
        {clinicsPage?.content?.map((clinic, i) => (
          <div
            key={clinic.id}
            className="clinic-card"
            onClick={() => handleClinicSelect(clinic.id)}
          >
            <div className="clinic-card-header">
              <h3>{clinic.name}</h3>
              {clinic.logoUrl && (
                <img
                  src={clinic.logoUrl}
                  alt="Clinic Logo"
                  className="clinic-logo"
                />
              )}
            </div>
            <div className="clinic-card-details">
              <p>
                <strong>Phone:</strong> {clinic.phoneNumber || "Not specified"}
              </p>
              <p>
                <strong>Email:</strong> {clinic.email || "Not specified"}
              </p>
              <p>
                <strong>Address:</strong> {clinic.address || "Not specified"}
              </p>
            </div>
            <button
              className="view-button"
              onClick={(e) => {
                e.stopPropagation();
                handleClinicSelect(clinic.id);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="clinics-pagination">
        <Pagination
          currentPage={searchParams.page || 0}
          totalPages={clinicsPage?.totalPages || 0}
          onPageChange={handlePageChange}
          disabled={isPreviousData}
        />
      </div>
    </div>
  );
};

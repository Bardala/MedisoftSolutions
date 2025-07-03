import { useState } from "react";
import { ClinicReqDTO } from "../dto";
import { useCreateClinic } from "../hooks/useClinic";
import { useIntl } from "react-intl";
import { Clinic } from "../types";
import { ClinicsTable } from "./ClinicsTable";

export const CreateClinic = () => {
  const [clinicData, setClinicData] = useState<ClinicReqDTO>({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    logoUrl: "",
    workingHours: "",
    phoneSupportsWhatsapp: false,
  });
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);
  const [showCreatedClinic, setShowCreatedClinic] = useState(false);

  const { mutate: createClinic, isLoading } = useCreateClinic();
  const { formatMessage: f } = useIntl();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setClinicData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = () => {
    createClinic(clinicData, {
      onSuccess: (data) => {
        setCreatedClinic(data);
        setShowCreatedClinic(true);
        // Reset form if needed
        setClinicData({
          name: "",
          address: "",
          phoneNumber: "",
          email: "",
          logoUrl: "",
          workingHours: "",
          phoneSupportsWhatsapp: false,
        });
      },
    });
  };

  const handleCreateAnother = () => {
    setShowCreatedClinic(false);
    setCreatedClinic(null);
  };

  return (
    <div className="create-clinic-container">
      {!showCreatedClinic ? (
        <>
          <h2>{f({ id: "create_new_clinic" })}</h2>
          <div className="form-group">
            <input
              name="name"
              placeholder={f({ id: "name" })}
              value={clinicData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              name="address"
              placeholder={f({ id: "address" })}
              value={clinicData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="phoneNumber"
              placeholder={f({ id: "phone" })}
              value={clinicData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="email"
              placeholder={f({ id: "email" })}
              value={clinicData.email}
              onChange={handleChange}
              type="email"
            />
          </div>
          <div className="form-group">
            <input
              name="logoUrl"
              placeholder={f({ id: "logo_url" })}
              value={clinicData.logoUrl}
              onChange={handleChange}
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="phoneSupportsWhatsapp"
                checked={clinicData.phoneSupportsWhatsapp || false}
                onChange={handleChange}
              />
              {f({ id: "clinicSettings.phoneSupportsWhatsapp" })}
            </label>
          </div>
          <div className="form-group">
            <textarea
              name="workingHours"
              placeholder={f({ id: "working_hours" })}
              value={clinicData.workingHours}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !clinicData.name}
            className="submit-btn"
          >
            {isLoading ? f({ id: "creating" }) : f({ id: "create_clinic" })}
          </button>
        </>
      ) : (
        <div className="created-clinic-details">
          <div className="success-message">
            <h3>{f({ id: "clinic_created_successfully" })}</h3>
            {createdClinic?.logoUrl && (
              <img
                src={createdClinic.logoUrl}
                alt="Clinic logo"
                className="clinic-logo"
              />
            )}
          </div>

          <ClinicsTable clinics={createdClinic ? [createdClinic] : []} />

          <div className="action-buttons">
            <button
              onClick={handleCreateAnother}
              className="create-another-btn"
            >
              {f({ id: "create_another_clinic" })}
            </button>
            <button
              onClick={() => (window.location.href = "/super-admin/clinics")}
              className="view-all-btn"
            >
              {f({ id: "view_all_clinics" })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

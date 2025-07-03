import { useState } from "react";
import { useIntl } from "react-intl";
import { ClinicReqDTO, ClinicLimitsReqDTO } from "../dto";
import QRCodeComponent from "./QRCodeComponent";
import { UserRole } from "../types/types";
import { useCreateClinicWithOwner } from "../hooks/useCreateClinicWithOwner";

export const CreateClinicWithOwner = () => {
  const { formatMessage: f } = useIntl();

  // Form data states
  const [clinicData, setClinicData] = useState<ClinicReqDTO>({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    logoUrl: "",
    workingHours: "",
    phoneSupportsWhatsapp: false,
  });

  const [limitsData, setLimitsData] = useState<ClinicLimitsReqDTO>({
    maxUsers: 10,
    maxFileStorageMb: 1024,
    maxPatientRecords: 1000,
    allowFileUpload: true,
    allowMultipleBranches: false,
    allowBillingFeature: false,
  });

  const [ownerData, setOwnerData] = useState({
    username: "",
    name: "",
    password: "",
    phone: "",
  });

  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdData, setCreatedData] = useState<{
    clinic: any;
    owner: { username: string; password: string };
    limits: ClinicLimitsReqDTO;
  } | null>(null);

  const { createClinicWithOwner } = useCreateClinicWithOwner();

  // Handle all form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name in clinicData) {
      setClinicData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in limitsData) {
      setLimitsData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : Number(value),
      }));
    } else {
      setOwnerData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate all fields
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Clinic validation
    if (!clinicData.name) newErrors["name"] = f({ id: "clinic_name_required" });
    if (!clinicData.email) newErrors["email"] = f({ id: "email_required" });
    if (clinicData.email && !/^\S+@\S+\.\S+$/.test(clinicData.email)) {
      newErrors["email"] = f({ id: "invalid_email" });
    }

    // Limits validation
    if (limitsData.maxUsers <= 0)
      newErrors["maxUsers"] = f({ id: "invalid_max_users" });
    if (limitsData.maxFileStorageMb <= 0)
      newErrors["maxFileStorageMb"] = f({ id: "invalid_storage" });
    if (limitsData.maxPatientRecords <= 0)
      newErrors["maxPatientRecords"] = f({ id: "invalid_patient_records" });

    // Owner validation
    if (!ownerData.username)
      newErrors["ownerUsername"] = f({ id: "username_required" });
    if (!ownerData.name) newErrors["ownerName"] = f({ id: "name_required" });
    if (!ownerData.password || ownerData.password.length < 8) {
      newErrors["ownerPassword"] = f({ id: "password_requirements" });
    }
    if (!ownerData.phone) newErrors["ownerPhone"] = f({ id: "phone_required" });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await createClinicWithOwner(clinicData, limitsData, {
        username: ownerData.username,
        name: ownerData.name,
        password: ownerData.password,
        phone: ownerData.phone,
        role: UserRole.OWNER,
      });

      setCreatedData({
        clinic: result.clinic,
        owner: {
          username: result.owner.username,
          password: ownerData.password,
        },
        limits: result.limits,
      });
    } catch (error) {
      setErrors({
        form:
          error instanceof Error ? error.message : f({ id: "creation_failed" }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setIsSubmitted(false);
    setCreatedData(null);
    setClinicData({
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      logoUrl: "",
      workingHours: "",
      phoneSupportsWhatsapp: false,
    });
    setLimitsData({
      maxUsers: 10,
      maxFileStorageMb: 1024,
      maxPatientRecords: 1000,
      allowFileUpload: true,
      allowMultipleBranches: false,
      allowBillingFeature: false,
    });
    setOwnerData({
      username: "",
      name: "",
      password: "",
      phone: "",
    });
    setErrors({});
  };

  if (createdData) {
    return (
      <div className="success-section">
        <div className="success-message">
          <h3>{f({ id: "clinic_and_owner_created_successfully" })}</h3>
        </div>

        <div className="clinic-info">
          <h4>{f({ id: "clinic_information" })}</h4>
          <div className="clinic-details">
            <p>
              <strong>{f({ id: "name" })}:</strong> {createdData.clinic.name}
            </p>
            <p>
              <strong>{f({ id: "email" })}:</strong> {createdData.clinic.email}
            </p>
            <p>
              <strong>{f({ id: "phone" })}:</strong>{" "}
              {createdData.clinic.phoneNumber}
            </p>
          </div>

          <h5>{f({ id: "clinic_limits" })}</h5>
          <div className="limits-display">
            <p>
              <strong>{f({ id: "max_users" })}:</strong>{" "}
              {createdData.limits.maxUsers}
            </p>
            <p>
              <strong>{f({ id: "max_file_storage_mb" })}:</strong>{" "}
              {createdData.limits.maxFileStorageMb} MB
            </p>
            <p>
              <strong>{f({ id: "max_patient_records" })}:</strong>{" "}
              {createdData.limits.maxPatientRecords}
            </p>
            <p>
              <strong>{f({ id: "allow_file_upload" })}:</strong>
              {createdData.limits.allowFileUpload
                ? f({ id: "yes" })
                : f({ id: "no" })}
            </p>
          </div>
        </div>

        <div className="owner-credentials">
          <h4>{f({ id: "owner_account_details" })}</h4>
          <QRCodeComponent
            username={createdData.owner.username}
            password={createdData.owner.password}
          />
          <div className="credentials">
            <p>
              <strong>{f({ id: "username" })}:</strong>{" "}
              {createdData.owner.username}
            </p>
            <p>
              <strong>{f({ id: "password" })}:</strong>{" "}
              {createdData.owner.password}
            </p>
          </div>
        </div>

        <button onClick={handleCreateAnother} className="create-another-btn">
          {f({ id: "create_another_clinic" })}
        </button>
      </div>
    );
  }

  return (
    <div className="create-clinic-container">
      <h2>{f({ id: "create_new_clinic" })}</h2>

      {errors.form && <div className="error-message">{errors.form}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>{f({ id: "clinic_information" })}</h3>

          <div className={`form-group ${errors.name ? "has-error" : ""}`}>
            <label>{f({ id: "name" })}*</label>
            <input
              name="name"
              value={clinicData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>{f({ id: "address" })}</label>
            <input
              name="address"
              value={clinicData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "phone" })}</label>
            <input
              name="phoneNumber"
              value={clinicData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label>{f({ id: "email" })}*</label>
            <input
              name="email"
              type="email"
              value={clinicData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
        </div>

        <div className="form-section">
          <h3>{f({ id: "clinic_limits" })}</h3>

          <div className={`form-group ${errors.maxUsers ? "has-error" : ""}`}>
            <label>{f({ id: "max_users" })}*</label>
            <input
              type="number"
              name="maxUsers"
              min="1"
              value={limitsData.maxUsers}
              onChange={handleChange}
            />
            {errors.maxUsers && (
              <span className="error-text">{errors.maxUsers}</span>
            )}
          </div>

          <div
            className={`form-group ${
              errors.maxFileStorageMb ? "has-error" : ""
            }`}
          >
            <label>{f({ id: "max_file_storage_mb" })}*</label>
            <input
              type="number"
              name="maxFileStorageMb"
              min="1"
              value={limitsData.maxFileStorageMb}
              onChange={handleChange}
            />
            {errors.maxFileStorageMb && (
              <span className="error-text">{errors.maxFileStorageMb}</span>
            )}
          </div>

          <div
            className={`form-group ${
              errors.maxPatientRecords ? "has-error" : ""
            }`}
          >
            <label>{f({ id: "max_patient_records" })}*</label>
            <input
              type="number"
              name="maxPatientRecords"
              min="1"
              value={limitsData.maxPatientRecords}
              onChange={handleChange}
            />
            {errors.maxPatientRecords && (
              <span className="error-text">{errors.maxPatientRecords}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="allowFileUpload"
                checked={limitsData.allowFileUpload}
                onChange={handleChange}
              />
              {f({ id: "allow_file_upload" })}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>{f({ id: "owner_account" })}</h3>

          <div
            className={`form-group ${errors.ownerUsername ? "has-error" : ""}`}
          >
            <label>{f({ id: "username" })}*</label>
            <input
              name="username"
              value={ownerData.username}
              onChange={(e) => {
                handleChange(e);
                // Auto-fill email if clinic email is similar
                if (!ownerData.username && clinicData.email) {
                  setOwnerData((prev) => ({
                    ...prev,
                    username: clinicData.email.split("@")[0],
                  }));
                }
              }}
              required
            />
            {errors.ownerUsername && (
              <span className="error-text">{errors.ownerUsername}</span>
            )}
          </div>

          <div className={`form-group ${errors.ownerName ? "has-error" : ""}`}>
            <label>{f({ id: "full_name" })}*</label>
            <input
              name="name"
              value={ownerData.name}
              onChange={(e) => {
                handleChange(e);
                // Auto-fill owner name if empty
                if (!ownerData.name && clinicData.name) {
                  setOwnerData((prev) => ({
                    ...prev,
                    name: `${clinicData.name} Owner`,
                  }));
                }
              }}
              required
            />
            {errors.ownerName && (
              <span className="error-text">{errors.ownerName}</span>
            )}
          </div>

          <div
            className={`form-group ${errors.ownerPassword ? "has-error" : ""}`}
          >
            <label>{f({ id: "password" })}*</label>
            <input
              type="password"
              name="password"
              value={ownerData.password}
              onChange={handleChange}
              required
            />
            {errors.ownerPassword && (
              <span className="error-text">{errors.ownerPassword}</span>
            )}
          </div>

          <div className={`form-group ${errors.ownerPhone ? "has-error" : ""}`}>
            <label>{f({ id: "phone" })}*</label>
            <input
              name="phone"
              value={ownerData.phone}
              onChange={(e) => {
                handleChange(e);
                // Auto-fill phone if clinic phone is set
                if (!ownerData.phone && clinicData.phoneNumber) {
                  setOwnerData((prev) => ({
                    ...prev,
                    phone: clinicData.phoneNumber,
                  }));
                }
              }}
              required
            />
            {errors.ownerPhone && (
              <span className="error-text">{errors.ownerPhone}</span>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? f({ id: "creating" }) : f({ id: "create_clinic" })}
        </button>
      </form>
    </div>
  );
};

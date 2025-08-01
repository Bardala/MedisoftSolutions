import { useState } from "react";
import { useIntl } from "react-intl";
import QRCodeComponent from "./QRCodeComponent";
import { PlanType, SubscriptionStatus, UserRole } from "../types/types";
import { ClinicWithOwnerReq } from "../dto";
import { useCreateClinicWithOwner } from "../hooks/useClinic";
import { dateFormate } from "../utils";

export const CreateClinicWithOwner = () => {
  const { formatMessage: f } = useIntl();
  const {
    mutateAsync: createClinicWithOwner,
    isLoading,
    isSuccess,
    error,
    isError,
    data,
  } = useCreateClinicWithOwner();

  const [formData, setFormData] = useState<ClinicWithOwnerReq>({
    clinic: {
      name: "clinic",
      address: "📍القاهرة - مصر",
      phoneNumber: "0100000000",
      email: "",
      logoUrl: "",
      workingHours: "يوميا عدا الجمعة من 12 ظهرا حتى 12 من منتصف الليل",
      phoneSupportsWhatsapp: false,
    },
    limits: {
      maxUsers: 5,
      maxFileStorageMb: 512,
      maxVisitCount: 50,
      maxPatientRecords: 100,
      allowFileUpload: true,
      allowMultipleBranches: false,
      allowBillingFeature: false,
    },
    owner: {
      username: "",
      name: "",
      password: "",
      phone: "0100000000",
      role: UserRole.OWNER,
      profilePicture: "",
    },
    plan: {
      planType: PlanType.MONTHLY,
      startDate: new Date(),
      pricePerVisit: 0,
      monthlyPrice: 0,
      yearlyPrice: 0,
      status: SubscriptionStatus.ACTIVE,
      autoRenew: true,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : undefined;
    const path = name.split(".");

    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = isCheckbox ? checked : value;
      return newData;
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const path = name.split(".");

    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = new Date(value);
      return newData;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClinicWithOwner(formData);
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  const handleCreateAnother = () => {
    setFormData({
      clinic: {
        name: "",
        address: "📍",
        phoneNumber: "",
        email: "",
        logoUrl: "",
        workingHours: "يوميا عدا الجمعة من 12 ظهرا حتى 12 من منتصف الليل",
        phoneSupportsWhatsapp: false,
      },
      limits: {
        maxUsers: 5,
        maxFileStorageMb: 512,
        maxVisitCount: 50,
        maxPatientRecords: 100,
        allowFileUpload: true,
        allowMultipleBranches: false,
        allowBillingFeature: false,
      },
      owner: {
        username: "",
        name: "",
        password: "",
        phone: "",
        role: UserRole.OWNER,
        profilePicture: "",
      },
      plan: {
        planType: PlanType.MONTHLY,
        startDate: new Date(),
        pricePerVisit: 0,
        monthlyPrice: 0,
        yearlyPrice: 0,
        status: SubscriptionStatus.ACTIVE,
        autoRenew: true,
      },
    });
  };

  if (isSuccess && data) {
    return (
      <div className="success-section">
        <div className="success-message">
          <h3>{f({ id: "clinic_and_owner_created_successfully" })}</h3>
        </div>

        <div className="clinic-info">
          <h4>{f({ id: "clinic_information" })}</h4>
          <div className="clinic-details">
            <p>
              <strong>{f({ id: "name" })}:</strong> {data.clinic.name}
            </p>
            <p>
              <strong>{f({ id: "email" })}:</strong> {data.clinic.email}
            </p>
            <p>
              <strong>{f({ id: "phone" })}:</strong> {data.clinic.phoneNumber}
            </p>
          </div>

          <h5>{f({ id: "clinic_limits" })}</h5>
          <div className="limits-display">
            <p>
              <strong>{f({ id: "max_users" })}:</strong> {data.limits.maxUsers}
            </p>
            <p>
              <strong>{f({ id: "max_file_storage_mb" })}:</strong>{" "}
              {data.limits.maxFileStorageMb} MB
            </p>
            <p>
              <strong>{f({ id: "max_patient_records" })}:</strong>{" "}
              {data.limits.maxPatientRecords}
            </p>
          </div>

          <h5>{f({ id: "billing_plan" })}</h5>
          <div className="plan-display">
            <p>
              <strong>{f({ id: "plan_type" })}:</strong> {data.plan?.planType}
            </p>
            <p>
              <strong>{f({ id: "start_date" })}:</strong>{" "}
              {dateFormate(data.plan.startDate)}
            </p>
            {data.plan.endDate && (
              <p>
                <strong>{f({ id: "end_date" })}:</strong>{" "}
                {dateFormate(data.plan.endDate)}
              </p>
            )}
            <p>
              <strong>{f({ id: "monthly_price" })}:</strong>{" "}
              {data.plan?.monthlyPrice}
            </p>
          </div>
        </div>

        <div className="owner-credentials">
          <h4>{f({ id: "owner_account_details" })}</h4>
          <QRCodeComponent
            username={data.owner.username}
            password={formData.owner.password}
          />
          <div className="credentials">
            <p>
              <strong>{f({ id: "username" })}:</strong> {data.owner.username}
            </p>
            <p>
              <strong>{f({ id: "password" })}:</strong>{" "}
              {formData.owner.password}
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

      <form onSubmit={onSubmit}>
        <div className="form-section">
          <h3>{f({ id: "clinic_information" })}</h3>

          <div className="form-group">
            <label>{f({ id: "name" })}</label>
            <input
              name="clinic.name"
              value={formData.clinic.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "address" })}</label>
            <input
              name="clinic.address"
              value={formData.clinic.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "phone" })}</label>
            <input
              name="clinic.phoneNumber"
              value={formData.clinic.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "email" })}</label>
            <input
              type="email"
              name="clinic.email"
              value={formData.clinic.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="clinic.phoneSupportsWhatsapp"
                checked={formData.clinic.phoneSupportsWhatsapp}
                onChange={handleChange}
              />
              {f({ id: "clinicSettings.phoneSupportsWhatsapp" })}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>{f({ id: "clinic_limits" })}</h3>

          <div className="form-group">
            <label>{f({ id: "max_users" })}</label>
            <input
              type="number"
              min="1"
              name="limits.maxUsers"
              value={formData.limits.maxUsers}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "max_file_storage_mb" })}</label>
            <input
              type="number"
              min="1"
              name="limits.maxFileStorageMb"
              value={formData.limits.maxFileStorageMb}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "max_patient_records" })}</label>
            <input
              type="number"
              min="1"
              name="limits.maxPatientRecords"
              value={formData.limits.maxPatientRecords}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "max_visit_count" })}</label>
            <input
              type="number"
              min="1"
              name="limits.maxVisitCount"
              value={formData.limits.maxVisitCount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="limits.allowFileUpload"
                checked={formData.limits.allowFileUpload}
                onChange={handleChange}
              />
              {f({ id: "allow_file_upload" })}
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="limits.allowMultipleBranches"
                checked={formData.limits.allowMultipleBranches}
                onChange={handleChange}
              />
              {f({ id: "allow_multiple_branches" })}
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="limits.allowBillingFeature"
                checked={formData.limits.allowBillingFeature}
                onChange={handleChange}
              />
              {f({ id: "enable_billing_features" })}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>{f({ id: "owner_account" })}</h3>

          <div className="form-group">
            <label>{f({ id: "username" })}</label>
            <input
              name="owner.username"
              value={formData.owner.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "full_name" })}</label>
            <input
              name="owner.name"
              value={formData.owner.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "password" })}</label>
            <input
              type="password"
              name="owner.password"
              value={formData.owner.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{f({ id: "phone" })}</label>
            <input
              name="owner.phone"
              value={formData.owner.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>{f({ id: "billing_plan" })}</h3>
          <div className="form-group">
            <label>{f({ id: "plan_type" })}</label>
            <select
              name="plan.planType"
              value={formData.plan.planType}
              onChange={handleChange}
            >
              {Object.values(PlanType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{f({ id: "start_date" })}</label>
            <input
              type="date"
              name="plan.startDate"
              value={formData.plan.startDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
            />
          </div>

          {formData.plan.planType !== PlanType.VISIT_BASED && (
            <div className="form-group">
              <label>{f({ id: "end_date" })} (optional)</label>
              <input
                type="date"
                name="plan.endDate"
                value={formData.plan.endDate?.toISOString().split("T")[0] || ""}
                onChange={handleDateChange}
              />
            </div>
          )}

          {formData.plan.planType === PlanType.VISIT_BASED && (
            <div className="form-group">
              <label>{f({ id: "price_per_visit" })}</label>
              <input
                type="number"
                step="0.01"
                name="plan.pricePerVisit"
                value={formData.plan.pricePerVisit}
                onChange={handleChange}
              />
            </div>
          )}
          {formData.plan.planType === PlanType.MONTHLY && (
            <div className="form-group">
              <label>{f({ id: "monthly_price" })}</label>
              <input
                type="number"
                step="0.01"
                name="plan.monthlyPrice"
                value={formData.plan.monthlyPrice}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.plan.planType === PlanType.YEARLY && (
            <div className="form-group">
              <label>{f({ id: "yearly_price" })}</label>
              <input
                type="number"
                step="0.01"
                name="plan.yearlyPrice"
                value={formData.plan.yearlyPrice}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>{f({ id: "subscription_status" })}</label>
            <select
              name="plan.subscriptionStatus"
              value={formData.plan.status}
              onChange={handleChange}
            >
              {Object.values(SubscriptionStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="plan.autoRenew"
                checked={formData.plan.autoRenew}
                onChange={handleChange}
              />
              {f({ id: "auto_renew" })}
            </label>
          </div>
        </div>

        {isError && error?.errors && (
          <ul>
            {Object.entries(error.errors).map(([fieldName, errorMessage]) => (
              <li key={fieldName} className="error">
                <strong>{fieldName.replace(".", " ")}:</strong> {errorMessage}
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? f({ id: "creating" }) : f({ id: "create_clinic" })}
        </button>
      </form>
    </div>
  );
};

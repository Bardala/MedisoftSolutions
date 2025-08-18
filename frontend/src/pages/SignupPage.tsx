import { useState } from "react";
import { useIntl } from "react-intl";
import { PlanType, SubscriptionStatus, UserRole } from "../types/types";
import { ClinicWithOwnerReq } from "../dto";
import { useCreateClinicWithOwner } from "../hooks/useClinic";
import "../styles/signup.css";
import { PlanSelector } from "../components/PlanSelector";
import { AppRoutes } from "../constants";
import { useNavigate } from "react-router-dom";
import QRCodeComponent from "../components/QRCodeComponent";

// todo: fix selected plan
export const SignupPage = () => {
  const nav = useNavigate();
  const { formatMessage: f } = useIntl();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(
    PlanType.MONTHLY,
  );
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
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      logoUrl: "",
      workingHours: "",
      phoneSupportsWhatsapp: false,
    },
    limits: null,
    owner: {
      username: "",
      name: "",
      password: "",
      phone: "",
      role: UserRole.OWNER,
      profilePicture: "",
    },
    plan: {
      planType: selectedPlan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      pricePerVisit: 0,
      monthlyPrice: 0,
      yearlyPrice: 0,
      status: SubscriptionStatus.ACTIVE,
      autoRenew: true,
      isTrial: true,
    },
  });

  const handlePlanSelect = (planType: PlanType) => {
    setSelectedPlan(planType);
    setFormData((prev) => ({
      ...prev,
      plan: {
        planType: selectedPlan,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        pricePerVisit: selectedPlan === PlanType.VISIT_BASED ? 5 : 0,
        monthlyPrice:
          selectedPlan === PlanType.MONTHLY
            ? 300
            : selectedPlan === PlanType.FREE
            ? 100
            : 0,
        yearlyPrice: selectedPlan === PlanType.YEARLY ? 2500 : 0,
        status: SubscriptionStatus.ACTIVE,
        autoRenew: true,
        isTrial: true,
      },
      limits: null,
    }));
  };

  // const getLimitsForPlan = (planType: PlanType) => {
  //   switch (planType) {
  //     case PlanType.FREE:
  //       return {
  //         maxUsers: 2,
  //         maxFileStorageMb: 512,
  //         maxVisitCount: 1000,
  //         maxPatientRecords: 1000,
  //         allowFileUpload: true,
  //         allowMultipleBranches: false,
  //         allowBillingFeature: false,
  //       };
  //     case PlanType.VISIT_BASED:
  //       return {
  //         maxUsers: 5,
  //         maxFileStorageMb: 1024,
  //         maxVisitCount: null,
  //         maxPatientRecords: null,
  //         allowFileUpload: true,
  //         allowMultipleBranches: false,
  //         allowBillingFeature: true,
  //       };
  //     case PlanType.MONTHLY:
  //     case PlanType.YEARLY:
  //       return {
  //         maxUsers: null,
  //         maxFileStorageMb: null,
  //         maxVisitCount: null,
  //         maxPatientRecords: null,
  //         allowFileUpload: true,
  //         allowMultipleBranches: true,
  //         allowBillingFeature: true,
  //       };
  //     default:
  //       return null;
  //   }
  // };

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClinicWithOwner(formData);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  if (isSuccess && data) {
    return (
      <div className="signup-success-container">
        <div className="signup-success-card">
          <div className="success-icon">✓</div>
          <h2>{f({ id: "signup_successful" })}</h2>
          <p className="success-message">{f({ id: "welcome_message" })}</p>

          <div className="info-card">
            <h3>{f({ id: "clinic_information" })}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">{f({ id: "name" })}:</span>
                <span className="info-value">{data.clinic.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{f({ id: "email" })}:</span>
                <span className="info-value">{data.clinic.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{f({ id: "phone" })}:</span>
                <span className="info-value">{data.clinic.phoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="info-card credentials-card">
            <h3>{f({ id: "account_details" })}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">{f({ id: "username" })}:</span>
                <span className="info-value">{data.owner.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{f({ id: "password" })}:</span>
                <span className="info-value">{formData.owner.password}</span>
              </div>
            </div>
          </div>

          <QRCodeComponent
            username={data.owner.username}
            password={formData.owner.password}
          />

          <button
            className="continue-button"
            onClick={() => nav(AppRoutes.LOGIN)}
          >
            {f({ id: "continue_to_login" })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>{f({ id: "create_your_account" })}</h1>
          <p>{f({ id: "setup_your_clinic" })}</p>
        </div>

        <form className="signup-form" onSubmit={onSubmit}>
          <div className="form-section">
            <h2 className="section-title">{f({ id: "clinic_information" })}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{f({ id: "name" })}*</label>
                <input
                  name="clinic.name"
                  value={formData.clinic.name}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "clinic_name_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "address" })}*</label>
                <input
                  name="clinic.address"
                  value={formData.clinic.address}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "clinic_address_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "phone" })}*</label>
                <input
                  name="clinic.phoneNumber"
                  value={formData.clinic.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "clinic_phone_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "email" })}*</label>
                <input
                  type="email"
                  name="clinic.email"
                  value={formData.clinic.email}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "clinic_email_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "working_hours" })}</label>
                <input
                  name="clinic.workingHours"
                  value={formData.clinic.workingHours}
                  onChange={handleChange}
                  placeholder="9:00 AM - 5:00 PM"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="clinic.phoneSupportsWhatsapp"
                    checked={formData.clinic.phoneSupportsWhatsapp}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  {f({ id: "clinicSettings.phoneSupportsWhatsapp" })}
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              {f({ id: "account_information" })}
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{f({ id: "username" })}*</label>
                <input
                  name="owner.username"
                  value={formData.owner.username}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "username_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "full_name" })}*</label>
                <input
                  name="owner.name"
                  value={formData.owner.name}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "full_name_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "password" })}*</label>
                <input
                  type="password"
                  name="owner.password"
                  value={formData.owner.password}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "password_placeholder" })}
                />
              </div>

              <div className="form-group">
                <label>{f({ id: "phone" })}*</label>
                <input
                  name="owner.phone"
                  value={formData.owner.phone}
                  onChange={handleChange}
                  required
                  placeholder={f({ id: "phone_placeholder" })}
                />
              </div>
            </div>
          </div>

          <div className="form-section plan-section">
            <h2 className="section-title">{f({ id: "select_your_plan" })}</h2>
            <PlanSelector
              selectedPlan={selectedPlan}
              onSelect={handlePlanSelect}
              isTrialPeriod={true}
            />
          </div>

          {isError && error?.errors && (
            <div className="error-message">
              {Object.entries(error.errors).map(([fieldName, errorMessage]) => (
                <p key={fieldName}>
                  <strong>{fieldName.replace(".", " ")}:</strong> {errorMessage}
                </p>
              ))}
            </div>
          )}

          <div className="form-footer">
            <button
              type="submit"
              className={`submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="button-loader"></span>
              ) : (
                f({ id: "create_account" })
              )}
            </button>
            <p className="terms-notice">
              By creating an account, you agree to our{" "}
              <a href={AppRoutes.TERMS}>{f({ id: "terms_of_service" })}</a>
              {/* and{" "}
              <a href={AppRoutes.PRIVACY_POLICY}>
                {f({ id: "privacy_policy" })}
              </a> */}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

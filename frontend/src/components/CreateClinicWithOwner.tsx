import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import QRCodeComponent from "./QRCodeComponent";
import { UserRole } from "../types/types";
import { ClinicWithOwnerReq } from "../dto";
import { useCreateClinicWithOwner } from "../hooks/useClinic";

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClinicWithOwnerReq>({
    defaultValues: {
      clinic: {
        name: "",
        address: "",
        phoneNumber: "",
        email: "",
        logoUrl: "",
        workingHours: "",
        phoneSupportsWhatsapp: false,
      },
      limits: {
        maxUsers: 10,
        maxFileStorageMb: 1024,
        maxPatientRecords: 1000,
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
    },
  });

  const onSubmit = async (data: ClinicWithOwnerReq) => {
    try {
      await createClinicWithOwner(data);
    } catch (error) {
      console.error("Creation failed:", error);
    }
  };

  const handleCreateAnother = () => {
    reset();
  };

  // Auto-fill logic using watch
  const watchedClinicEmail = watch("clinic.email");
  const watchedClinicName = watch("clinic.name");
  const watchedClinicPhone = watch("clinic.phoneNumber");

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
        </div>

        <div className="owner-credentials">
          <h4>{f({ id: "owner_account_details" })}</h4>
          <QRCodeComponent
            username={data.owner.username}
            password={watch("owner.password")} // Using the original password
          />
          <div className="credentials">
            <p>
              <strong>{f({ id: "username" })}:</strong> {data.owner.username}
            </p>
            <p>
              <strong>{f({ id: "password" })}:</strong>{" "}
              {watch("owner.password")}
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-section">
          <h3>{f({ id: "clinic_information" })}</h3>

          <div
            className={`form-group ${errors.clinic?.name ? "has-error" : ""}`}
          >
            <label>{f({ id: "name" })}*</label>
            <input
              {...register("clinic.name", {
                required: f({ id: "clinic_name_required" }),
              })}
            />
            {errors.clinic?.name && (
              <span className="error-text">{errors.clinic.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>{f({ id: "address" })}</label>
            <input {...register("clinic.address")} />
          </div>

          <div className="form-group">
            <label>{f({ id: "phone" })}</label>
            <input {...register("clinic.phoneNumber")} />
          </div>

          <div
            className={`form-group ${errors.clinic?.email ? "has-error" : ""}`}
          >
            <label>{f({ id: "email" })}*</label>
            <input
              type="email"
              {...register("clinic.email", {
                required: f({ id: "email_required" }),
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: f({ id: "invalid_email" }),
                },
              })}
            />
            {errors.clinic?.email && (
              <span className="error-text">{errors.clinic.email.message}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                {...register("clinic.phoneSupportsWhatsapp")}
              />
              {f({ id: "clinicSettings.phoneSupportsWhatsapp" })}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>{f({ id: "clinic_limits" })}</h3>

          <div
            className={`form-group ${
              errors.limits?.maxUsers ? "has-error" : ""
            }`}
          >
            <label>{f({ id: "max_users" })}*</label>
            <input
              type="number"
              min="1"
              {...register("limits.maxUsers", {
                required: f({ id: "max_users_required" }),
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: f({ id: "invalid_max_users" }),
                },
              })}
            />
            {errors.limits?.maxUsers && (
              <span className="error-text">
                {errors.limits.maxUsers.message}
              </span>
            )}
          </div>

          {/* Similar pattern for other limit fields */}
        </div>

        <div className="form-section">
          <h3>{f({ id: "owner_account" })}</h3>

          <div
            className={`form-group ${
              errors.owner?.username ? "has-error" : ""
            }`}
          >
            <label>{f({ id: "username" })}*</label>
            <input
              {...register("owner.username", {
                required: f({ id: "username_required" }),
                onBlur: (e) => {
                  if (!e.target.value && watchedClinicEmail) {
                    e.target.value = watchedClinicEmail.split("@")[0];
                  }
                },
              })}
            />
            {errors.owner?.username && (
              <span className="error-text">
                {errors.owner.username.message}
              </span>
            )}
          </div>

          <div
            className={`form-group ${errors.owner?.name ? "has-error" : ""}`}
          >
            <label>{f({ id: "full_name" })}*</label>
            <input
              {...register("owner.name", {
                required: f({ id: "name_required" }),
                onBlur: (e) => {
                  if (!e.target.value && watchedClinicName) {
                    e.target.value = `${watchedClinicName} Owner`;
                  }
                },
              })}
            />
            {errors.owner?.name && (
              <span className="error-text">{errors.owner.name.message}</span>
            )}
          </div>

          <div
            className={`form-group ${
              errors.owner?.password ? "has-error" : ""
            }`}
          >
            <label>{f({ id: "password" })}*</label>
            <input
              type="password"
              {...register("owner.password", {
                required: f({ id: "password_required" }),
              })}
            />
            {errors.owner?.password && (
              <span className="error-text">
                {errors.owner.password.message}
              </span>
            )}
          </div>

          <div
            className={`form-group ${errors.owner?.phone ? "has-error" : ""}`}
          >
            <label>{f({ id: "phone" })}*</label>
            <input
              {...register("owner.phone", {
                required: f({ id: "phone_required" }),
                onBlur: (e) => {
                  if (!e.target.value && watchedClinicPhone) {
                    e.target.value = watchedClinicPhone;
                  }
                },
              })}
            />
            {errors.owner?.phone && (
              <span className="error-text">{errors.owner.phone.message}</span>
            )}
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

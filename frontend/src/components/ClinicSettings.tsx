import { useEffect, useState } from "react";
import "../styles/clinicSettings.css";
import { useFormate } from "../hooks/useFormateMessage";
import {
  useGetClinicSettings,
  useGetCurrentClinic,
  useUpdateClinic,
  useUpdateClinicSettings,
} from "../hooks/useClinic";
import { ClinicResDTO, ClinicSettingsResDTO } from "../dto";
import { ClinicStaff } from "./ClinicStaff";
import { ClinicLimits } from "./ClinicLimits";

export const ClinicSettings = () => {
  const {
    data: clinicData,
    isLoading: isLoadingClinic,
    error: clinicError,
  } = useGetCurrentClinic();

  const { mutate: updateClinic, isSuccess: isSuccessClinic } =
    useUpdateClinic();

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isClinicError,
  } = useGetClinicSettings();

  const { mutate: updateSettings, isSuccess: isSuccessSettings } =
    useUpdateClinicSettings();

  const msg = useFormate();
  const [settings, setSettings] = useState<ClinicSettingsResDTO | null>(null);
  const [clinic, setClinic] = useState<ClinicResDTO | null>(null);

  useEffect(() => {
    if (settingsData) setSettings(settingsData);
  }, [settingsData]);

  useEffect(() => {
    if (clinicData) setClinic(clinicData);
  }, [clinicData]);

  const handleSettingsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleClinicChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setClinic((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmitSettings = () => {
    if (settings) {
      updateSettings({
        data: {
          ...settings,
        },
      });
    }
  };

  const handleSubmitClinic = () => {
    if (clinic) {
      updateClinic({
        data: {
          ...clinic,
        },
      });
    }
  };

  return (
    <div className="clinic-settings-container">
      <h2 className="clinic-settings-title">
        🛠️ {msg("clinicSettings.title")}
      </h2>
      <div className="clinic-settings-form">
        {clinic && (
          <>
            {(isLoadingClinic || isLoadingSettings) && <p>{msg("loading")}</p>}
            {isClinicError && (
              <p className="error">
                {msg("error") + ": " + clinicError.message}
              </p>
            )}
            <fieldset>
              <legend>🏥 {msg("clinicSettings.clinicSection")}</legend>
              <label>{msg("clinicSettings.clinicName")}</label>
              <input
                name="name"
                value={clinic.name || ""}
                onChange={handleClinicChange}
              />

              <label>{msg("clinicSettings.clinicAddress")}</label>
              <textarea
                name="address"
                value={clinic.address || ""}
                onChange={handleClinicChange}
              />

              <label>{msg("clinicSettings.clinicPhoneNumber")}</label>
              <input
                name="phoneNumber"
                value={clinic.phoneNumber || ""}
                onChange={handleClinicChange}
              />

              <label>{msg("clinicSettings.clinicEmail")}</label>
              <input
                name="email"
                value={clinic.email || ""}
                onChange={handleClinicChange}
                disabled
              />

              <label>{msg("clinicSettings.workingHours")}</label>
              <input
                name="workingHours"
                value={clinic.workingHours || ""}
                onChange={handleClinicChange}
              />
            </fieldset>
            <fieldset>
              <legend>🖼️ {msg("clinicSettings.visualSection")}</legend>
              <label>{msg("clinicSettings.prescriptionLogoPath")}</label>
              <input
                name="logoUrl"
                value={clinic.logoUrl || ""}
                onChange={handleClinicChange}
                disabled
              />
            </fieldset>
            <fieldset>
              <legend>📱 {msg("clinicSettings.phoneSection")}</legend>
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    name="phoneSupportsWhatsapp"
                    checked={clinic.phoneSupportsWhatsapp || false}
                    onChange={handleClinicChange}
                    // disabled
                  />
                  {msg("clinicSettings.phoneSupportsWhatsapp")}
                </label>
              </div>
            </fieldset>
            {isSuccessClinic && <p className="success">{msg("success")}</p>}
            <button
              className="clinic-settings-save"
              onClick={handleSubmitClinic}
            >
              💾 {msg("clinicSettings.save")}
            </button>
          </>
        )}
      </div>

      <div className="clinic-settings-form">
        {settings && (
          <>
            <fieldset>
              <legend>👨‍⚕️ {msg("clinicSettings.doctorSection")}</legend>
              <label>{msg("clinicSettings.doctorName")}</label>
              <input
                name="doctorName"
                value={settings.doctorName || ""}
                onChange={handleSettingsChange}
              />

              <label>{msg("clinicSettings.doctorTitle")}</label>
              <input
                name="doctorTitle"
                value={settings.doctorTitle || ""}
                onChange={handleSettingsChange}
              />

              <label>{msg("clinicSettings.doctorQualification")}</label>
              <input
                name="doctorQualification"
                value={settings.doctorQualification || ""}
                onChange={handleSettingsChange}
              />
            </fieldset>

            <fieldset>
              <legend>💾 {msg("clinicSettings.backupSection")}</legend>
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    name="backupEnabled"
                    checked={settings.backupEnabled || false}
                    onChange={handleSettingsChange}
                    disabled
                  />
                  {msg("clinicSettings.backupEnabled")}
                </label>
              </div>

              {/* <label>{msg("clinicSettings.backupDbPath")}</label>
              <input
                name="backupDbPath"
                value={settings.backupDbPath || ""}
                onChange={handleChange}
              /> */}

              {/* <label>{msg("clinicSettings.backupImagesPath")}</label>
              <input
                name="backupImagesPath"
                value={settings.backupImagesPath || ""}
                onChange={handleChange}
              /> */}

              {/* <label>{msg("clinicSettings.backupIntervalDays")}</label>
              <input
                type="number"
                name="backupIntervalDays"
                value={settings.backupIntervalDays || ""}
                onChange={handleChange}
                disabled
              /> */}
            </fieldset>

            <fieldset>
              <legend>📝 {msg("clinicSettings.notesSection")}</legend>
              <label>{msg("clinicSettings.healingMessage")}</label>
              <textarea
                name="healingMessage"
                value={settings.healingMessage || ""}
                onChange={handleSettingsChange}
              />

              <label>{msg("clinicSettings.printFooterNotes")}</label>
              <textarea
                name="printFooterNotes"
                value={settings.printFooterNotes || ""}
                onChange={handleSettingsChange}
              />
            </fieldset>

            <fieldset>
              <legend>🌐 {msg("clinicSettings.languageSection")}</legend>
              <label>{msg("clinicSettings.language")}</label>
              <input
                name="language"
                value={settings.language || ""}
                onChange={handleSettingsChange}
                disabled
              />
            </fieldset>

            {isSuccessSettings && <p className="success">{msg("success")}</p>}
            <button
              className="clinic-settings-save"
              onClick={handleSubmitSettings}
            >
              💾 {msg("clinicSettings.save")}
            </button>
          </>
        )}

        <ClinicLimits clinicId={clinic?.id} />
        <ClinicStaff clinicId={clinic?.id} />
      </div>
    </div>
  );
};

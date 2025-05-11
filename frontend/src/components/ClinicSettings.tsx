import { useEffect, useState } from "react";
import {
  useGetClinicSettings,
  useUpdateClinicSettings,
} from "../hooks/useClinicSettings";
import { IClinicSettings } from "../types";
import "../styles/clinicSettings.css";
import { useFormate } from "../hooks/useFormateMessage";

export const ClinicSettings = () => {
  const { query } = useGetClinicSettings();
  const { updateMutation } = useUpdateClinicSettings();

  const msg = useFormate;
  const [settings, setSettings] = useState<IClinicSettings | null>(null);

  useEffect(() => {
    if (query.data) setSettings(query.data);
  }, [query.data]);

  const handleChange = (
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

  const handleSubmit = () => {
    if (settings) updateMutation.mutate(settings);
  };

  if (query.isLoading) return <p>{msg("loading")}</p>;
  if (query.error) return <p>{msg("error")}</p>;

  return (
    <div className="clinic-settings-container">
      <h2 className="clinic-settings-title">
        🛠️ {msg("clinicSettings.title")}
      </h2>
      <div className="clinic-settings-form">
        {settings && (
          <>
            <fieldset>
              <legend>👨‍⚕️ {msg("clinicSettings.doctorSection")}</legend>
              <label>{msg("clinicSettings.doctorName")}</label>
              <input
                name="doctorName"
                value={settings.doctorName || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.doctorTitle")}</label>
              <input
                name="doctorTitle"
                value={settings.doctorTitle || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.doctorQualification")}</label>
              <input
                name="doctorQualification"
                value={settings.doctorQualification || ""}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset>
              <legend>🏥 {msg("clinicSettings.clinicSection")}</legend>
              <label>{msg("clinicSettings.clinicAddress")}</label>
              <textarea
                name="clinicAddress"
                value={settings.clinicAddress || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.clinicPhoneNumber")}</label>
              <input
                name="clinicPhoneNumber"
                value={settings.clinicPhoneNumber || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.clinicEmail")}</label>
              <input
                name="clinicEmail"
                value={settings.clinicEmail || ""}
                onChange={handleChange}
                disabled
              />

              <label>{msg("clinicSettings.workingHours")}</label>
              <input
                name="workingHours"
                value={settings.workingHours || ""}
                onChange={handleChange}
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
                    onChange={handleChange}
                    disabled
                  />
                  {msg("clinicSettings.backupEnabled")}
                </label>
              </div>

              <label>{msg("clinicSettings.backupDbPath")}</label>
              <input
                name="backupDbPath"
                value={settings.backupDbPath || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.backupImagesPath")}</label>
              <input
                name="backupImagesPath"
                value={settings.backupImagesPath || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.backupIntervalDays")}</label>
              <input
                type="number"
                name="backupIntervalDays"
                value={settings.backupIntervalDays || ""}
                onChange={handleChange}
                disabled
              />
            </fieldset>

            <fieldset>
              <legend>🖼️ {msg("clinicSettings.visualSection")}</legend>
              <label>{msg("clinicSettings.prescriptionLogoPath")}</label>
              <input
                name="prescriptionLogoPath"
                value={settings.prescriptionLogoPath || ""}
                onChange={handleChange}
                disabled
              />
            </fieldset>

            <fieldset>
              <legend>📝 {msg("clinicSettings.notesSection")}</legend>
              <label>{msg("clinicSettings.healingMessage")}</label>
              <textarea
                name="healingMessage"
                value={settings.healingMessage || ""}
                onChange={handleChange}
              />

              <label>{msg("clinicSettings.printFooterNotes")}</label>
              <textarea
                name="printFooterNotes"
                value={settings.printFooterNotes || ""}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset>
              <legend>🌐 {msg("clinicSettings.languageSection")}</legend>
              <label>{msg("clinicSettings.language")}</label>
              <input
                name="language"
                value={settings.language || ""}
                onChange={handleChange}
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
                    checked={settings.phoneSupportsWhatsapp || false}
                    onChange={handleChange}
                    disabled
                  />
                  {msg("clinicSettings.phoneSupportsWhatsapp")}
                </label>
              </div>
            </fieldset>

            {updateMutation.isSuccess && (
              <p className="success">{msg("success")}</p>
            )}
            <button className="clinic-settings-save" onClick={handleSubmit}>
              💾 {msg("clinicSettings.save")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

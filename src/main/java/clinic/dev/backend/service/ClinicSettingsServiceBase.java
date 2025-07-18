package clinic.dev.backend.service;

import clinic.dev.backend.model.ClinicSettings;

public interface ClinicSettingsServiceBase {
  ClinicSettings saveSettings(ClinicSettings settings);

  ClinicSettings getSettings();

  ClinicSettings updateSettings(Long id, ClinicSettings updatedSettings);
}

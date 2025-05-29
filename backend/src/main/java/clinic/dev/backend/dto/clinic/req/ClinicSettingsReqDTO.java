package clinic.dev.backend.dto.clinic.req;

import clinic.dev.backend.model.ClinicSettings;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClinicSettingsReqDTO(
    @NotBlank String doctorName,
    @NotBlank String doctorTitle,
    String doctorQualification,
    @NotBlank String language,
    @NotNull Boolean backupEnabled,
    String backupFrequencyCron,
    String healingMessage,
    String printFooterNotes) {

  public ClinicSettings toEntity() {
    return ClinicSettings.builder()
        .doctorName(doctorName)
        .doctorTitle(doctorTitle)
        .doctorQualification(doctorQualification)
        .language(language)
        .backupEnabled(backupEnabled)
        .backupFrequencyCron(backupFrequencyCron)
        .healingMessage(healingMessage)
        .printFooterNotes(printFooterNotes)
        .build();
  }

  public void updateEntity(ClinicSettings settings) {
    settings.setDoctorName(doctorName);
    settings.setDoctorTitle(doctorTitle);
    settings.setDoctorQualification(doctorQualification);
    settings.setLanguage(language);
    settings.setBackupEnabled(backupEnabled);
    settings.setBackupFrequencyCron(backupFrequencyCron);
    settings.setHealingMessage(healingMessage);
    settings.setPrintFooterNotes(printFooterNotes);
  }
}
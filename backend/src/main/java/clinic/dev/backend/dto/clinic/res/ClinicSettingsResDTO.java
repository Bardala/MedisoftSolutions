package clinic.dev.backend.dto.clinic.res;

import clinic.dev.backend.model.ClinicSettings;

public record ClinicSettingsResDTO(
    Long id,
    String doctorName,
    String doctorTitle,
    String doctorQualification,
    String language,
    Boolean backupEnabled,
    String backupFrequencyCron,
    String healingMessage,
    String printFooterNotes) {

  public static ClinicSettingsResDTO fromEntity(ClinicSettings settings) {
    return new ClinicSettingsResDTO(
        settings.getId(),
        settings.getDoctorName(),
        settings.getDoctorTitle(),
        settings.getDoctorQualification(),
        settings.getLanguage(),
        settings.getBackupEnabled(),
        settings.getBackupFrequencyCron(),
        settings.getHealingMessage(),
        settings.getPrintFooterNotes());
  }
}
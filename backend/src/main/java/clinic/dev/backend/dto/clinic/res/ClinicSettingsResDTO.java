package clinic.dev.backend.dto.clinic.res;

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
}
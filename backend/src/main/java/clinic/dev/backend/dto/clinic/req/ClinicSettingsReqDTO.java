package clinic.dev.backend.dto.clinic.req;

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
}

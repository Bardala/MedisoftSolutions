package clinic.dev.backend.dto.clinic.req;

import jakarta.validation.constraints.*;

public record ClinicReqDTO(
    @NotBlank String name,
    @NotBlank String address,
    @NotBlank @Pattern(regexp = "^\\+?[0-9\\s-]+$") String phoneNumber,
    @NotBlank @Email String email,
    String logoUrl,
    String workingHours,
    @NotNull Boolean phoneSupportsWhatsapp,
    ClinicSettingsReqDTO settings,
    ClinicLimitsReqDTO limits) {
}

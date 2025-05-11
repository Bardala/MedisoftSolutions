package clinic.dev.backend.dto.clinic.res;

public record ClinicResDTO(
    Long id,
    String name,
    String address,
    String phoneNumber,
    String email,
    String logoUrl,
    String workingHours,
    Boolean phoneSupportsWhatsapp,
    ClinicSettingsResDTO settings,
    ClinicLimitsResDTO limits) {
}
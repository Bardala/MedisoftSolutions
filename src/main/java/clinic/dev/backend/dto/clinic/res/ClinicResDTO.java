package clinic.dev.backend.dto.clinic.res;

import clinic.dev.backend.model.Clinic;

public record ClinicResDTO(
    Long id,
    String name,
    String address,
    String phoneNumber,
    String email,
    String logoUrl,
    String workingHours,
    Boolean phoneSupportsWhatsapp) {

  public static ClinicResDTO fromEntity(Clinic clinic) {
    return new ClinicResDTO(
        clinic.getId(),
        clinic.getName(),
        clinic.getAddress(),
        clinic.getPhoneNumber(),
        clinic.getEmail(),
        clinic.getLogoUrl(),
        clinic.getWorkingHours(),
        clinic.getPhoneSupportsWhatsapp());
  }
}
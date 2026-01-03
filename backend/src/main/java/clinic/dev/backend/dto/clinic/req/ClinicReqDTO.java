package clinic.dev.backend.dto.clinic.req;

import clinic.dev.backend.model.Clinic;
import jakarta.validation.constraints.*;

public record ClinicReqDTO(
    @NotBlank String name,
    @NotBlank String address,
    @NotBlank @Pattern(regexp = "^\\+?[0-9\\s-]+$", message = "Phone must start with 0 and be 10-15 digits") String phoneNumber,
    @NotBlank @Email String email,
    String logoUrl,
    String workingHours,
    @NotNull Boolean phoneSupportsWhatsapp) {
  public Clinic toEntity() {
    return Clinic.builder()
        .name(name)
        .address(address)
        .phoneNumber(phoneNumber)
        .email(email)
        .logoUrl(logoUrl)
        .workingHours(workingHours)
        .phoneSupportsWhatsapp(phoneSupportsWhatsapp)
        .build();
  }

  public void updateEntity(Clinic clinic) {
    clinic.setName(this.name);
    clinic.setAddress(address);
    clinic.setPhoneNumber(phoneNumber);
    clinic.setEmail(email);
    clinic.setWorkingHours(workingHours);
    clinic.setPhoneSupportsWhatsapp(phoneSupportsWhatsapp);
  }
}

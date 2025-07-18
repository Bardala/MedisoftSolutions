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
    return new Clinic(
        null,
        name,
        address,
        phoneNumber,
        email,
        logoUrl,
        workingHours,
        phoneSupportsWhatsapp,
        null,
        null,
        null,
        null,
        null);
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

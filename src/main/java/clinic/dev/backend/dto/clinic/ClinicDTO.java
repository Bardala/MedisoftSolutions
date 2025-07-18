package clinic.dev.backend.dto.clinic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ClinicDTO {
  Long id; // Nullable for creation

  @NotBlank(message = "name is required")
  String name;

  @NotBlank(message = "address is required")
  String address;

  @NotBlank(message = "phoneNumber is required")
  @Pattern(regexp = "^\\+?[0-9\\s-]+$", message = "Invalid phone number")
  String phoneNumber;

  @NotBlank(message = "email is required")
  @Pattern(regexp = ".+@.+\\..+", message = "Invalid email")
  String email;

  String logoUrl; // Optional
  String workingHours; // Optional

  @NotNull(message = "phoneSupportsWhatsapp is required")
  Boolean phoneSupportsWhatsapp;

  ClinicSettingsDTO settings; // Validated nested DTO
  ClinicLimitsDTO limits; // Validated nested DTO
}
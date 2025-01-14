package clinic.dev.backend.dto.patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreatePatientReq {
  @NotBlank(message = "Full name is required")
  private String fullName;

  @NotBlank(message = "Phone number is required")
  @Pattern(regexp = "^0\\d{9,14}$", message = "Phone number must start with 0 and be 10 to 15 digits long")
  private String phone;

  private String dateOfBirth;
  private String medicalHistory;
  private Integer age;
  private String address;
  private String notes;
}
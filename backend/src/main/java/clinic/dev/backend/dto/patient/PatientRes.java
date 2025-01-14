package clinic.dev.backend.dto.patient;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PatientRes {
  private Long id;
  private String fullName;
  private String phone;
  private String dateOfBirth;
  private String notes;
  private String medicalHistory;
  private Integer age;
  private String address;
  private LocalDateTime created_at;
}
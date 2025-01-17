package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import clinic.dev.backend.constants.ErrorMsg;

@Entity
@Data
@Table(name = "patients", uniqueConstraints = {
    @UniqueConstraint(columnNames = "full_name")
})
@NoArgsConstructor
public class Patient {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  @Column(name = "full_name", length = 200, nullable = false, unique = true)
  private String fullName;

  @Column(nullable = true)
  private Integer age;

  @Column(nullable = true)
  private String notes;

  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  @Column(name = "phone", length = 20, nullable = false)
  private String phone;

  @Column(nullable = true)
  private String address;

  @Column(name = "medical_history", nullable = true, length = 500)
  private String medicalHistory;

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;
}
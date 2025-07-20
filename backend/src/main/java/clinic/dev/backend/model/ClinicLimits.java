package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "clinic_limits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicLimits {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "clinic_id", nullable = false, unique = true)
  private Clinic clinic;

  @Column(name = "max_users", nullable = false)
  @Min(1)
  private Integer maxUsers;

  @Column(name = "max_file_storage_mb", nullable = false)
  @Min(0)
  private Integer maxFileStorageMb;

  @Column(name = "max_patient_records", nullable = false)
  private Integer maxPatientRecords;

  @Column(name = "allow_file_upload", nullable = false, columnDefinition = "boolean default false")
  private Boolean allowFileUpload;

  @Column(name = "allow_multiple_branches", nullable = false, columnDefinition = "boolean default false")
  private Boolean allowMultipleBranches;

  @Column(name = "allow_billing_feature", nullable = false, columnDefinition = "boolean default false")
  private Boolean allowBillingFeature;
}
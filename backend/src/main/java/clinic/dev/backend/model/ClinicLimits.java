package clinic.dev.backend.model;

import jakarta.persistence.*;
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

  @Column(name = "max_users")
  private Integer maxUsers;

  @Column(name = "max_file_storage_mb")
  private Integer maxFileStorageMb;

  @Column(name = "max_patient_records")
  private Integer maxPatientRecords;

  @Column(name = "allow_file_upload")
  private Boolean allowFileUpload;

  @Column(name = "allow_multiple_branches")
  private Boolean allowMultipleBranches;

  @Column(name = "allow_billing_feature")
  private Boolean allowBillingFeature;
}
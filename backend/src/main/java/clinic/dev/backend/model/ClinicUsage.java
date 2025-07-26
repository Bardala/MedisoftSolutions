package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "clinic_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicUsage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "clinic_id", nullable = false, unique = true)
  private Clinic clinic;

  @Column(name = "visit_count", nullable = false)
  private Integer visitCount;

  @Column(name = "patient_count", nullable = false)
  private Integer patientCount;

  @Column(name = "last_visit_added")
  private Instant lastVisitAdded;

  public ClinicUsage(Long clinicId, int visitCount, int patientCount) {
    this.clinic = new Clinic(clinicId);
    this.visitCount = visitCount;
    this.patientCount = patientCount;
  }
}

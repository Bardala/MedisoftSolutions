package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "visit_services")
@NoArgsConstructor
@AllArgsConstructor
public class VisitDentalProcedure {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "visit_id", nullable = false)
  private Visit visit;

  @ManyToOne
  @JoinColumn(name = "service_id", nullable = false)
  private DentalProcedure dentalProcedure;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false, columnDefinition = "bigint default 1")
  private Clinic clinic;
}
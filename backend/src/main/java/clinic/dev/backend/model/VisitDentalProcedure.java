package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "visit_services")
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
}
package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "visit_payments")
@NoArgsConstructor
@AllArgsConstructor
public class VisitPayment { // todo: add constraints (paymentId, visitId), and check their existence
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "visit_id", nullable = false)
  private Visit visit;

  @ManyToOne
  @JoinColumn(name = "payment_id", nullable = false)
  private Payment payment;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false, columnDefinition = "bigint default 1")
  private Clinic clinic;
}
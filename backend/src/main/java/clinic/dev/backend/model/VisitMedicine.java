package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// todo: Add unique constraints (medicineId, visitId)
@Entity
@Data
@Table(name = "visit_medicines")
@NoArgsConstructor
@AllArgsConstructor
public class VisitMedicine {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "visit_id", nullable = false)
  private Visit visit;

  @ManyToOne
  @JoinColumn(name = "medicine_id", nullable = false)
  private Medicine medicine;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false, columnDefinition = "bigint default 1")
  private Clinic clinic;
}
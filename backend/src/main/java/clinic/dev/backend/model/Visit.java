package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Visit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private Patient patient;

  @ManyToOne
  private DentalProcedure service;

  @ManyToOne
  private Payment payment; // Can be null if no payment is made.

  private LocalDateTime date;
}

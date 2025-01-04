package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DentalProcedure {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @Column(length = 1000)
  private String description;

  private Double price;
}

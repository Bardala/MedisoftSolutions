package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Medicine {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @Column(length = 1000)
  private String description;
}

package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * We used DentalProcedure word instead of Service to prevent errors whiling
 * importing
 */
@Entity
@Data
@Table(name = "services", uniqueConstraints = {
    @UniqueConstraint(columnNames = "service_name")
})
public class DentalProcedure {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Service name must not be blank")
  @Column(name = "service_name", length = 150, nullable = false, unique = true)
  private String serviceName;

  @Column(length = 1000, nullable = true)
  private String description;

  @Column(name = "cost", nullable = false)
  private Double cost;
}
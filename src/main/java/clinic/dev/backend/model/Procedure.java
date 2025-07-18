package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * We used DentalProcedure word instead of Service to prevent errors whiling
 * importing
 */
@Entity
@Data
@Table(name = "services", uniqueConstraints = {
    @UniqueConstraint(columnNames = "service_name")
})
@NoArgsConstructor
@AllArgsConstructor
public class Procedure { // todo: Add createdAt
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false)
  private Clinic clinic;

  @NotBlank(message = "Service name must not be blank")
  @Column(name = "service_name", length = 150, nullable = false, unique = true)
  private String serviceName;

  @NotBlank(message = "Arabic Service name is required")
  @Column(name = "arabic_name", length = 150, nullable = false)
  private String arabicName;

  @Column(length = 1000, nullable = true)
  private String description;

  @Column(name = "cost", nullable = false)
  private Double cost;

  public Procedure(Long id) {
    this.id = id;
  }

  // todo: Remove
  public Procedure(String serviceName, String arabicName, String description, double cost) {
    this.serviceName = serviceName;
    this.arabicName = arabicName;
    this.description = description;
    this.cost = cost;
  }
}
package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  private Double amount;

  @ManyToOne
  private Patient patient;

  @ManyToOne
  private User recordedBy;

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;
}

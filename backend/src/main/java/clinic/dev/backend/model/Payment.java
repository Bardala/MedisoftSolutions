package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import clinic.dev.backend.constants.ErrorMsg;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

  public Payment(Long id) {
    this.id = id;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false)
  private Clinic clinic;

  @NotNull(message = ErrorMsg.MUST_NOT_BE_NULL)
  @Column(nullable = false)
  @Min(0)
  private Double amount;

  @ManyToOne
  private Patient patient;

  @ManyToOne
  private User recordedBy;

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;
}

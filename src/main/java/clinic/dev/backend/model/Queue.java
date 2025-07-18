package clinic.dev.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "queue", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "doctor_id", "patient_id" })
})
@NoArgsConstructor
@AllArgsConstructor
public class Queue {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false) // Clinic is required for each queue entry
  private Clinic clinic;

  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  @NotNull(message = "Patient cannot be null")
  private Patient patient;

  @ManyToOne
  @JoinColumn(name = "doctor_id", nullable = false)
  @NotNull(message = "Doctor cannot be null")
  private User doctor;

  @ManyToOne
  @JoinColumn(name = "assistant_id", nullable = true)
  private User assistant;

  @Column(nullable = false)
  @Min(1)
  private Integer position; // The position of the patient in the queue

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status; // WAITING, IN_PROGRESS, COMPLETED

  @Column(nullable = true, name = "estimated_wait_time")
  private Integer estimatedWaitTime; // Estimated wait time in minutes

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;

  @Column(nullable = true, name = "updated_at")
  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public enum Status {
    WAITING,
    IN_PROGRESS,
    COMPLETED
  }
}

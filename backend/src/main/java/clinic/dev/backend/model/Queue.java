package clinic.dev.backend.model;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

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
@Table(name = "queues", uniqueConstraints = {
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
  private Instant createdAt;

  @Column(nullable = true, name = "updated_at")
  @UpdateTimestamp
  private Instant updatedAt;

  public enum Status {
    WAITING,
    IN_PROGRESS,
    COMPLETED
  }

  /**
   * Calculates estimated wait time based on historical data
   * 
   * @param previousQueues List of recent completed queues for this doctor
   * @return Estimated wait time in minutes
   */
  public static int calculateEstimatedWaitTime(List<Queue> previousQueues) {
    if (previousQueues == null || previousQueues.isEmpty()) {
      return 15; // Default fallback value
    }

    // Calculate average processing time from historical data
    double average = previousQueues.stream()
        .filter(q -> q.getStatus() == Status.COMPLETED)
        .filter(q -> q.getCreatedAt() != null && q.getUpdatedAt() != null)
        .mapToLong(q -> {
          Duration duration = Duration.between(q.getCreatedAt(), q.getUpdatedAt());
          return duration.toMinutes();
        })
        .average()
        .orElse(15.0); // Default if no valid data

    // Round up to nearest 5 minutes
    return (int) (Math.ceil(average / 5) * 5);
  }

  /**
   * Updates the estimated wait time based on position and historical data
   * 
   * @param previousQueues List of recent completed queues for this doctor
   */
  public void updateEstimatedWaitTime(List<Queue> previousQueues) {
    if (this.position == null || this.position <= 1) {
      this.estimatedWaitTime = 0;
      return;
    }

    int avgProcessingTime = calculateEstimatedWaitTime(previousQueues);
    this.estimatedWaitTime = (this.position - 1) * avgProcessingTime;
  }
}

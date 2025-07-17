package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import clinic.dev.backend.constants.ErrorMsg;

@Entity
@Data
@Table(name = "visits")
@NoArgsConstructor
@AllArgsConstructor
public class Visit {

  public Visit(Long id) {
    this.id = id;
  };

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  @NotNull(message = ErrorMsg.USER_CANNOT_BE_NULL)
  private Patient patient;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false)
  private Clinic clinic;

  @ManyToOne
  @JoinColumn(name = "doctor_id", nullable = false)
  @NotNull(message = "Doctor cannot be null")
  private User doctor;

  @ManyToOne
  @JoinColumn(name = "assistant_id", nullable = true)
  private User assistant;

  @Column(name = "wait", nullable = true)
  private Integer wait;

  @Column(name = "duration", nullable = true)
  private Integer duration;

  @Column(name = "doctor_notes", nullable = true, length = 500)
  private String doctorNotes;

  @Column(name = "created_at", updatable = false)
  @CreationTimestamp
  private LocalDateTime createdAt;
}
package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Double amount;

  @ManyToOne
  private Patient patient;

  @ManyToOne
  private User recordedBy;

  @Temporal(TemporalType.DATE)
  private Date date; // todo: Remove this field

  @Column(nullable = false, updatable = false)
  @Temporal(TemporalType.TIMESTAMP)
  @org.hibernate.annotations.CreationTimestamp
  private LocalDateTime timestamp;

  @PrePersist
  protected void onCreate() {
    timestamp = LocalDateTime.now();
  }
}

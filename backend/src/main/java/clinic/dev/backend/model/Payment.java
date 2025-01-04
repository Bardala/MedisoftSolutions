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

  private LocalDateTime timestamp;

  @ManyToOne
  private Patient patient;

  @ManyToOne
  private User recordedBy;

  @Temporal(TemporalType.DATE)
  private Date date; // Add this field
}

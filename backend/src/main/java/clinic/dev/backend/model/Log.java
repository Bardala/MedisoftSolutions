package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Log {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String timestamp;

  @Column
  private Long userId; // Nullable for system-level logs

  @Column(nullable = false)
  private String action;

  @Column(columnDefinition = "TEXT")
  private String details;

  @Column
  private String ipAddress;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private LogLevel logLevel;

  @Column(columnDefinition = "TEXT")
  private String stackTrace;
}
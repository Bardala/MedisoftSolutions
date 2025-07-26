package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Data
@Table(name = "patient_files")
@NoArgsConstructor
public class PatientFile { // todo: add file size

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "clinic_id", nullable = false) // Clinic is required for each patient file
  private Clinic clinic;

  /** Reference to the associated patient. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  /** File type, e.g., "medical_test", "x_ray", "old_log", "other" */
  @Column(nullable = false, length = 50)
  private String fileType;

  /** A brief description of the file. */
  @Column(length = 200)
  private String description;

  /** Path or URL to the stored file. */
  @Column(nullable = true, length = 300)
  private String filePath;

  @Column(name = "file_size", nullable = false)
  private Long fileSize;

  /** Timestamp of when the file was uploaded. */
  @Column(nullable = false, updatable = false, name = "uploaded_at")
  @CreationTimestamp
  private Instant createdAt;
}

package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Data
@Table(name = "clinic_settings")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicSettings {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "clinic_id", nullable = false, unique = true)
  private Clinic clinic;

  @Column(name = "doctor_name")
  private String doctorName;

  @Column(name = "doctor_title")
  private String doctorTitle;

  @Column(name = "doctor_qualification")
  private String doctorQualification;

  // Paths
  @Column(name = "backup_db_path", columnDefinition = "TEXT")
  private String backupDbPath;

  @Column(name = "backup_images_path", columnDefinition = "TEXT")
  private String backupImagesPath;

  @Column(name = "healing_message", columnDefinition = "TEXT")
  private String healingMessage;

  @Column(name = "print_footer_notes", columnDefinition = "TEXT")
  private String printFooterNotes;

  @Column(name = "language")
  private String language;

  // Backup config
  @Column(name = "backup_enabled")
  private Boolean backupEnabled;

  @Column(name = "backup_frequency_cron")
  private String backupFrequencyCron;

  // Timestamps
  @Column(name = "created_at", updatable = false)
  @CreationTimestamp
  private Instant createdAt;

  @Column(name = "updated_at")
  @UpdateTimestamp
  private Instant updatedAt;
}

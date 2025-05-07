package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "clinic_settings")
public class ClinicSettings {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Doctor info, // todo: Remove it
  @Column(name = "doctor_id")
  private Long doctorId;

  @Column(name = "doctor_name")
  private String doctorName;

  @Column(name = "doctor_title")
  private String doctorTitle;

  @Column(name = "doctor_qualification")
  private String doctorQualification;

  // Clinic info
  @Column(name = "clinic_address", columnDefinition = "TEXT")
  private String clinicAddress;

  @Column(name = "clinic_phone_number")
  private String clinicPhoneNumber;

  @Column(name = "clinic_email")
  private String clinicEmail;

  @Column(name = "working_hours", columnDefinition = "TEXT")
  private String workingHours;

  // Paths
  @Column(name = "backup_db_path", columnDefinition = "TEXT")
  private String backupDbPath;

  @Column(name = "backup_images_path", columnDefinition = "TEXT")
  private String backupImagesPath;

  // Logos and Print Config
  @Column(name = "prescription_logo_path")
  private String prescriptionLogoPath;

  // New field: whether the phone supports whatsapp
  @Column(name = "phone_supports_whatsapp")
  private Boolean phoneSupportsWhatsapp;

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
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  @UpdateTimestamp
  private LocalDateTime updatedAt;
}

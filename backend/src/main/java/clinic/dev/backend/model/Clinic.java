package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "clinics", indexes = {
    @Index(name = "idx_clinics_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clinic {

  public Clinic(Long id) {
    this.id = id;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "address")
  private String address;

  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "email")
  @Email
  private String email;

  @Column(name = "logo_url")
  private String logoUrl;

  @Column(name = "working_hours", columnDefinition = "TEXT")
  private String workingHours;

  @Column(name = "phone_supports_whatsapp")
  private Boolean phoneSupportsWhatsapp;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private Instant updatedAt;

  @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<User> doctors;

  @OneToOne(mappedBy = "clinic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private ClinicLimits clinicLimits;

  @OneToOne(mappedBy = "clinic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private ClinicSettings clinicSettings;
}

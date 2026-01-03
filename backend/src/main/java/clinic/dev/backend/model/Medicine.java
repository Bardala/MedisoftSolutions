package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import clinic.dev.backend.constants.ErrorMsg;

@Entity
@Data
@Table(name = "medicines", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "clinic_id", "medicine_name" })
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

  public Medicine(Long id) {
    this.id = id;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = false)
  private Clinic clinic;

  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  @Column(name = "medicine_name", length = 150, nullable = false)
  private String medicineName;

  /** Specifies the amount of medicine to be taken each time (e.g., "500 mg"). */
  @Column(nullable = false)
  private String dosage; // e.g., "500 mg"

  /** Specifies the frequency of taking the medicine (e.g., "Twice a day"). */
  @Column(nullable = false)
  private String frequency; // e.g., "Twice a day"

  /** Specifies the duration of taking the medicine (e.g., "7" days). */
  @Column(nullable = false)
  @Min(1)
  private Integer duration; // e.g., "7" (days)

  /** Additional instructions, e.g., "Take after meals". */
  @Column(nullable = true)
  private String instructions; // Additional instructions, e.g., "Take after meals"

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private Instant createdAt;

  @OneToMany(mappedBy = "medicine", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  @Builder.Default
  private List<VisitMedicine> visitMedicines = new ArrayList<>();
}
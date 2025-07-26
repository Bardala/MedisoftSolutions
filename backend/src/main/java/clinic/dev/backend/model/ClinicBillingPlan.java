package clinic.dev.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.Instant;

import clinic.dev.backend.model.enums.PlanType;
import clinic.dev.backend.model.enums.SubscriptionStatus;

@Entity
@Table(name = "clinic_billing_plan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicBillingPlan {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "clinic_id", nullable = false, unique = true)
  private Clinic clinic;

  @Enumerated(EnumType.STRING)
  @Column(name = "plan_type", nullable = false)
  private PlanType planType;

  @Column(name = "start_date", nullable = false)
  private Instant startDate;

  @Column(name = "end_date")
  private Instant endDate;

  @Min(0)
  @NotNull
  @Column(name = "price_per_visit", nullable = false)
  @Builder.Default
  private Double pricePerVisit = 0.0;

  @Min(0)
  @NotNull
  @Column(name = "monthly_price", nullable = false)
  @Builder.Default
  private Double monthlyPrice = 0.0;

  @Min(0)
  @NotNull
  @Column(name = "yearly_price", nullable = false)
  @Builder.Default
  private Double yearlyPrice = 0.0;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private SubscriptionStatus status;

  @Column(name = "auto_renew", nullable = false)
  private Boolean autoRenew;
}
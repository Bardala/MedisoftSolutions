package clinic.dev.backend.dto.clinic.res;

import java.time.Instant;

import clinic.dev.backend.model.ClinicBillingPlan;
import clinic.dev.backend.model.enums.PlanType;
import clinic.dev.backend.model.enums.SubscriptionStatus;

public record ClinicBillingPlanResDTO(
    Long id,
    Long clinicId,
    PlanType planType,
    Instant startDate,
    Instant endDate,
    Double pricePerVisit,
    Double monthlyPrice,
    Double yearlyPrice,
    SubscriptionStatus status,
    Boolean autoRenew) {
  public static ClinicBillingPlanResDTO fromEntity(ClinicBillingPlan plan) {
    return new ClinicBillingPlanResDTO(
        plan.getId(),
        plan.getClinic().getId(),
        plan.getPlanType(),
        plan.getStartDate(),
        plan.getEndDate(),
        plan.getPricePerVisit(),
        plan.getMonthlyPrice(),
        plan.getYearlyPrice(),
        plan.getStatus(),
        plan.getAutoRenew());
  }
}
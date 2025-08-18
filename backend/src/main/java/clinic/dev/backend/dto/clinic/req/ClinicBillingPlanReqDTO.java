package clinic.dev.backend.dto.clinic.req;

import java.time.Instant;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicBillingPlan;
import clinic.dev.backend.model.enums.PlanType;
import clinic.dev.backend.model.enums.SubscriptionStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ClinicBillingPlanReqDTO(
    @NotNull PlanType planType,
    @NotNull Instant startDate,
    Instant endDate,
    @NotNull @Min(0) Double pricePerVisit,
    @NotNull @Min(0) Double monthlyPrice,
    @NotNull @Min(0) Double yearlyPrice,
    @NotNull SubscriptionStatus status,
    @NotNull Boolean autoRenew,
    @NotNull Boolean isTrial) {

  public ClinicBillingPlan toEntity(Long clinicId) {
    return ClinicBillingPlan.builder()
        .clinic(new Clinic(clinicId))
        .planType(planType)
        .startDate(startDate)
        .endDate(endDate)
        .pricePerVisit(pricePerVisit)
        .monthlyPrice(monthlyPrice)
        .yearlyPrice(yearlyPrice)
        .status(status)
        .autoRenew(autoRenew)
        .build();
  }

  public void updateEntity(ClinicBillingPlan billingPlan, Long clinicId) {
    billingPlan.setPlanType(planType);
    billingPlan.setStartDate(startDate);
    billingPlan.setEndDate(endDate);
    billingPlan.setPricePerVisit(pricePerVisit);
    billingPlan.setMonthlyPrice(monthlyPrice);
    billingPlan.setYearlyPrice(yearlyPrice);
    billingPlan.setStatus(status);
    billingPlan.setAutoRenew(autoRenew);
    billingPlan.setClinic(new Clinic(clinicId));
  }
}
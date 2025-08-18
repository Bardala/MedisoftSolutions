package clinic.dev.backend.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import clinic.dev.backend.dto.clinic.req.ClinicBillingPlanReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.model.enums.PlanType;
import clinic.dev.backend.model.enums.SubscriptionStatus;

@Service
public class PlanConfigurationService {

  public ClinicLimitsReqDTO getLimitsForPlan(PlanType planType) {
    return switch (planType) {
      case FREE -> new ClinicLimitsReqDTO(
          2,
          512,
          1000,
          1000,
          true,
          false,
          false);
      case MONTHLY -> new ClinicLimitsReqDTO(
          5,
          2024,
          5000,
          10000,
          true,
          false,
          false);
      default -> throw new IllegalArgumentException("Unsupported plan type: " + planType);
    };
  }

  public ClinicBillingPlanReqDTO getBillingPlan(PlanType planType, boolean isTrial) {
    Instant startDate = Instant.now();
    Instant endDate = isTrial ? startDate.plus(30, ChronoUnit.DAYS) : null;

    return switch (planType) {
      case FREE -> new ClinicBillingPlanReqDTO(
          planType,
          startDate,
          endDate,
          0.0,
          100.0,
          0.0,
          SubscriptionStatus.ACTIVE,
          true, true);
      case MONTHLY -> new ClinicBillingPlanReqDTO(
          planType,
          startDate,
          endDate,
          0.0,
          isTrial ? 0.0 : 300.0,
          0.0,
          SubscriptionStatus.ACTIVE,
          true, true);
      default -> throw new IllegalArgumentException("Unsupported plan type: " + planType);
    };
  }
}
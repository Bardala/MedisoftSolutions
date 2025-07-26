package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.model.ClinicBillingPlan;
import clinic.dev.backend.model.enums.PlanType;

public interface ClinicBillingPlanRepo extends JpaRepository<ClinicBillingPlan, Long> {
  @Query("SELECT c.planType FROM ClinicBillingPlan c WHERE c.clinic.id = :clinicId")
  PlanType findPlanTypeByClinicId(@Param("clinicId") Long clinicId);
}

package clinic.dev.backend.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.enums.PlanType;
import clinic.dev.backend.repository.ClinicBillingPlanRepo;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.repository.ClinicUsageRepo;
import clinic.dev.backend.repository.PatientFileRepo;
import clinic.dev.backend.util.AuthContext;

@Component("planValidation")
public class PlanValidation {

  @Autowired
  private AuthContext authContext;
  @Autowired
  private ClinicLimitsRepo clinicLimitsRepo;
  @Autowired
  private ClinicBillingPlanRepo billingPlanRepo;
  @Autowired
  private ClinicUsageRepo clinicUsageRepo;
  @Autowired
  private PatientFileRepo patientFileRepo;

  public boolean canCreatePatient() {
    Long clinicId = authContext.getClinicId();
    PlanType plan = billingPlanRepo.findPlanTypeByClinicId(clinicId);

    return switch (plan) {
      case FREE -> !clinicLimitsRepo.isPatientLimitReached(clinicId);
      case VISIT_BASED, MONTHLY, YEARLY -> true;
    };
  }

  public boolean canCreateVisit() {
    Long clinicId = authContext.getClinicId();
    PlanType plan = billingPlanRepo.findPlanTypeByClinicId(clinicId);

    return switch (plan) {
      case FREE -> !clinicLimitsRepo.isVisitLimitReached(clinicId);
      case VISIT_BASED, MONTHLY, YEARLY -> true;
    };
  }

  public boolean canUploadFile(long fileSizeInBytes) {
    Long clinicId = authContext.getClinicId();

    ClinicLimits limits = clinicLimitsRepo.findByClinicId(clinicId)
        .orElseThrow(() -> new RuntimeException("Limits not found"));

    // Sum of all previously uploaded file sizes in bytes
    Long usedBytes = patientFileRepo.sumFileSizeBytesByClinicId(clinicId);
    if (usedBytes == null)
      usedBytes = 0L;

    long totalUsed = usedBytes + fileSizeInBytes;

    // Convert limit from MB to bytes
    long allowedBytes = limits.getMaxFileStorageMb() * 1024L * 1024L;

    return totalUsed <= allowedBytes;
  }

  public void trackVisitIfNeeded() {
    Long clinicId = authContext.getClinicId();
    if (billingPlanRepo.findPlanTypeByClinicId(clinicId) == PlanType.VISIT_BASED) {
      clinicUsageRepo.incrementVisitCount(clinicId);
    }
  }

  public void trackPatientIfNeeded() {
    Long clinicId = authContext.getClinicId();
    if (billingPlanRepo.findPlanTypeByClinicId(clinicId) == PlanType.VISIT_BASED) {
      clinicUsageRepo.incrementPatientCount(clinicId);
    }
  }
}

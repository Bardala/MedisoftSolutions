package clinic.dev.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.util.AuthContext;

@Component("limits")
public class LimitsChecker {
  @Autowired
  private AuthContext authContext;

  @Autowired
  private ClinicLimitsRepo clinicLimitsRepo;

  public boolean isFileUploadAllowed() {
    Long clinicId = authContext.getClinicId();

    ClinicLimits clinicLimits = clinicLimitsRepo.findByClinicId(clinicId)
        .orElseThrow(() -> new IllegalStateException("Clinic limits not found for clinic ID: " + clinicId));

    return clinicLimits.getAllowFileUpload();
  }
}

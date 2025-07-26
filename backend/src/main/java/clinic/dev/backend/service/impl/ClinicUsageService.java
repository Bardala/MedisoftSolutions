package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.clinic.res.ClinicUsageResDTO;
import clinic.dev.backend.model.ClinicUsage;
import clinic.dev.backend.repository.ClinicUsageRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClinicUsageService {

  private final ClinicUsageRepo clinicUsageRepo;

  @Transactional(readOnly = true)
  public ClinicUsageResDTO getClinicUsage(Long clinicId) {
    ClinicUsage clinicUsage = clinicUsageRepo.findByClinicId(clinicId);

    return ClinicUsageResDTO.fromEntity(clinicUsage);
  }

}
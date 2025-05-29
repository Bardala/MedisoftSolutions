package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;

public interface ClinicServiceBase {
  public List<ClinicResDTO> getAllClinics();

  public ClinicResDTO createClinic(ClinicReqDTO request);

  public ClinicResDTO getClinicById(Long id);

  public ClinicResDTO getUserClinic();

  public ClinicResDTO updateClinicById(Long id, ClinicReqDTO request);

  public ClinicResDTO updateClinic(ClinicReqDTO request);

  public ClinicSettingsResDTO updateSettings(ClinicSettingsReqDTO request);

  public ClinicLimitsResDTO updateLimits(ClinicLimitsReqDTO request, Long clinicId);

  public void deleteClinic(Long id);
}

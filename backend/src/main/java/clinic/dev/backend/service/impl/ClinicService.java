package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UnauthorizedException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.repository.ClinicRepo;
import clinic.dev.backend.repository.ClinicSettingsRepo;
import clinic.dev.backend.service.ClinicServiceBase;
import clinic.dev.backend.util.AuthContext;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClinicService implements ClinicServiceBase {

  @Autowired
  private ClinicRepo clinicRepo;

  @Autowired
  private AuthContext authContext;

  @Autowired
  private ClinicSettingsRepo clinicSettingsRepo;

  @Autowired
  private ClinicLimitsRepo clinicLimitsRepo;

  @Override
  public List<ClinicResDTO> getAllClinics() {
    return clinicRepo
        .findAll()
        .stream()
        .map(ClinicResDTO::fromEntity)
        .toList();
  }

  @Override
  public ClinicResDTO createClinic(ClinicReqDTO request) {
    Clinic clinic = request.toEntity();

    return ClinicResDTO.fromEntity(clinicRepo.save(clinic));
  }

  @Override
  public ClinicResDTO getClinicById(Long id) {
    return ClinicResDTO.fromEntity(clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found")));
  }

  @Override
  public ClinicResDTO getUserClinic() {
    return ClinicResDTO.fromEntity(clinicRepo.findById(authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found")));
  }

  @Override
  public ClinicResDTO updateClinicById(Long id, ClinicReqDTO request) {
    Clinic clinic = clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found"));

    request.updateEntity(clinic);
    clinicRepo.save(clinic);

    return ClinicResDTO.fromEntity(clinicRepo.save(clinic));
  }

  @Override
  @Transactional
  public ClinicResDTO updateClinic(ClinicReqDTO request) {
    Long clinicId = authContext.getClinicId();

    return updateClinicById(clinicId, request);
  }

  @Override
  @Transactional
  public void deleteClinic(Long id) {
    Clinic clinic = clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found"));

    // Check if current user has permission to delete this clinic
    if (!authContext.isAdmin() && !authContext.getClinicId().equals(id)) {
      throw new UnauthorizedException("Not authorized to delete this clinic");
    }

    clinicRepo.delete(clinic);
  }

  @Override
  @Transactional
  public ClinicSettingsResDTO updateSettings(ClinicSettingsReqDTO request) {
    Long clinicId = authContext.getClinicId();

    ClinicSettings settings = clinicSettingsRepo.findByClinicId(clinicId)
        .orElseGet(() -> {
          ClinicSettings newSettings = request.toEntity();
          newSettings.setClinic(clinicRepo.getReferenceById(clinicId));
          return newSettings;
        });

    request.updateEntity(settings);
    return ClinicSettingsResDTO.fromEntity(clinicSettingsRepo.save(settings));
  }

  /**
   * @apiNote Limits should be recorded by system dashboard admin
   * @apiNote Limits should not be recorded by anyone from clinic staff
   */
  @Override
  @Transactional
  public ClinicLimitsResDTO updateLimits(ClinicLimitsReqDTO request, Long clinicId) {
    ClinicLimits limits = clinicLimitsRepo
        .findByClinicId(clinicId)
        .orElseGet(() -> {
          ClinicLimits newLimits = request.toEntity();
          newLimits.setClinic(clinicRepo.getReferenceById(clinicId));
          return newLimits;
        });

    request.updateEntity(limits);
    return ClinicLimitsResDTO.fromEntity(clinicLimitsRepo.save(limits));
  }

  public ClinicLimitsResDTO getLimits() {
    return ClinicLimitsResDTO
        .fromEntity(clinicLimitsRepo.findByClinicId(authContext.getClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("Clinic limits not found")));
  }

  /** @implNote for System dashboard admin */
  public ClinicLimitsResDTO getLimitsById(Long clinicId) {
    return ClinicLimitsResDTO
        .fromEntity(clinicLimitsRepo.findByClinicId(clinicId)
            .orElseThrow(() -> new ResourceNotFoundException("Clinic limits not found")));
  }

  public ClinicSettingsResDTO getSettings() {
    return ClinicSettingsResDTO
        .fromEntity(clinicSettingsRepo
            .findByClinicId(authContext
                .getClinicId())
            .orElseThrow(
                () -> new ResourceNotFoundException("Clinic settings not found")));
  }
}
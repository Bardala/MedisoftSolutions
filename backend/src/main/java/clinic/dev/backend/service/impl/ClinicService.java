package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.repository.ClinicRepo;
import clinic.dev.backend.repository.ClinicSettingsRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.util.ClinicMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClinicService {
  private final ClinicRepo clinicRepo;
  private final ClinicSettingsRepo settingsRepo;
  private final ClinicLimitsRepo limitsRepo;
  private final UserRepo userRepository;
  private final ClinicMapper mapper;

  public List<ClinicResDTO> getAllClinics() {
    return clinicRepo.findAll().stream().map(mapper::toResDTO).toList(); // map(clinic -> mapper.toResDTO(clinic))
  }

  @Transactional
  public ClinicResDTO createClinic(ClinicReqDTO request) {
    Clinic clinic = mapper.toEntity(request);
    Clinic savedClinic = clinicRepo.save(clinic);

    if (request.settings() != null) {
      ClinicSettings settings = mapper.toEntity(request.settings(), savedClinic);
      settingsRepo.save(settings);
    }

    if (request.limits() != null) {
      ClinicLimits limits = mapper.toEntity(request.limits(), savedClinic);
      limitsRepo.save(limits);
    }

    return mapper.toResDTO(savedClinic);
  }

  public ClinicResDTO getClinicById(Long id) {
    Clinic clinic = clinicRepo.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Clinic not found with id: " + id));
    return mapper.toResDTO(clinic);
  }

  // Update Clinic Info (basic fields only)
  @Transactional
  public ClinicResDTO updateClinic(Long id, ClinicReqDTO request) {
    Clinic existing = getClinicByIdEntity(id);

    // Update only non-null fields from request
    existing.setName(request.name());
    existing.setAddress(request.address());
    existing.setPhoneNumber(request.phoneNumber());
    existing.setEmail(request.email());
    existing.setLogoUrl(request.logoUrl());
    existing.setWorkingHours(request.workingHours());
    existing.setPhoneSupportsWhatsapp(request.phoneSupportsWhatsapp());

    return mapper.toResDTO(clinicRepo.save(existing));
  }

  // Update Clinic Settings
  @Transactional
  public ClinicSettingsResDTO updateSettings(Long clinicId, ClinicSettingsReqDTO request) {
    Clinic clinic = getClinicByIdEntity(clinicId);
    ClinicSettings settings = clinic.getClinicSettings() == null ? new ClinicSettings() : clinic.getClinicSettings();

    // Required fields (always non-null per DTO validation)
    settings.setDoctorName(request.doctorName());
    settings.setBackupEnabled(request.backupEnabled());
    settings.setLanguage(request.language());
    settings.setDoctorTitle(request.doctorTitle());

    // Optional fields (null-safe)
    settings.setDoctorQualification(request.doctorQualification()); // will set null if DTO has null
    settings.setBackupFrequencyCron(request.backupFrequencyCron());
    settings.setHealingMessage(request.healingMessage());
    settings.setPrintFooterNotes(request.printFooterNotes());

    settings.setClinic(clinic);
    return mapper.toResDTO(settingsRepo.save(settings));
  }

  // Update Clinic Limits
  @Transactional
  public ClinicLimitsResDTO updateLimits(Long clinicId, ClinicLimitsReqDTO request) {
    Clinic clinic = getClinicByIdEntity(clinicId);
    ClinicLimits limits = clinic.getClinicLimits() == null ? new ClinicLimits() : clinic.getClinicLimits();

    // All fields are guaranteed non-null by DTO validation
    limits.setMaxUsers(request.maxUsers());
    limits.setMaxFileStorageMb(request.maxFileStorageMb());
    limits.setMaxPatientRecords(request.maxPatientRecords());
    limits.setAllowFileUpload(request.allowFileUpload());
    limits.setAllowMultipleBranches(request.allowMultipleBranches());
    limits.setAllowBillingFeature(request.allowBillingFeature());

    limits.setClinic(clinic);
    return mapper.toResDTO(limitsRepo.save(limits));
  }

  // ! this method should will cause errors, you have to delete all related tables
  @Transactional
  public void deleteClinic(Long id) {
    Clinic clinic = getClinicByIdEntity(id);
    userRepository.deleteAllByClinicId(id);
    settingsRepo.deleteByClinicId(id);
    limitsRepo.deleteByClinicId(id);
    clinicRepo.delete(clinic);
  }

  // Helper: Get entity (internal use only)
  private Clinic getClinicByIdEntity(Long id) {
    return clinicRepo.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Clinic not found with id: " + id));
  }
}
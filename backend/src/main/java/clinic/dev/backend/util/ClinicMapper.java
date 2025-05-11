package clinic.dev.backend.util;

import org.springframework.stereotype.Component;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.ClinicSettings;

@Component
public class ClinicMapper {

  // ClinicReqDTO -> Clinic (for creation)
  public Clinic toEntity(ClinicReqDTO request) {
    return new Clinic(
        null, // ID is auto-generated
        request.name(),
        request.address(),
        request.phoneNumber(),
        request.email(),
        request.logoUrl(),
        request.workingHours(),
        request.phoneSupportsWhatsapp(),
        null,
        null,
        null, // doctors (lazy-loaded)
        null, // clinicLimits (set separately)
        null // clinicSettings (set separately)
    );
  }

  // ClinicLimitsReqDTO -> ClinicLimits
  public ClinicLimits toEntity(ClinicLimitsReqDTO request, Clinic clinic) {
    return new ClinicLimits(
        null, // ID
        clinic,
        request.maxUsers(),
        request.maxFileStorageMb(),
        request.maxPatientRecords(),
        request.allowFileUpload(),
        request.allowMultipleBranches(),
        request.allowBillingFeature());
  }

  // ClinicSettingsReqDTO -> ClinicSettings
  public ClinicSettings toEntity(ClinicSettingsReqDTO request, Clinic clinic) {
    return new ClinicSettings(
        null, // ID
        clinic,
        request.doctorName(),
        request.doctorTitle(),
        request.doctorQualification(),
        null,
        null,
        request.healingMessage(),
        request.printFooterNotes(),
        request.language(),
        request.backupEnabled(),
        request.backupFrequencyCron(),
        null, // createdAt
        null // updatedAt
    );
  }

  // Entity -> ResDTOs
  public ClinicResDTO toResDTO(Clinic clinic) {
    return new ClinicResDTO(
        clinic.getId(),
        clinic.getName(),
        clinic.getAddress(),
        clinic.getPhoneNumber(),
        clinic.getEmail(),
        clinic.getLogoUrl(),
        clinic.getWorkingHours(),
        clinic.getPhoneSupportsWhatsapp(),
        clinic.getClinicSettings() != null ? toResDTO(clinic.getClinicSettings()) : null,
        clinic.getClinicLimits() != null ? toResDTO(clinic.getClinicLimits()) : null);
  }

  public ClinicLimitsResDTO toResDTO(ClinicLimits limits) {
    return new ClinicLimitsResDTO(
        limits.getId(),
        limits.getMaxUsers(),
        limits.getMaxFileStorageMb(),
        limits.getMaxPatientRecords(),
        limits.getAllowFileUpload(),
        limits.getAllowMultipleBranches(),
        limits.getAllowBillingFeature());
  }

  public ClinicSettingsResDTO toResDTO(ClinicSettings settings) {
    return new ClinicSettingsResDTO(
        settings.getId(),
        settings.getDoctorName(),
        settings.getDoctorTitle(),
        settings.getDoctorQualification(),
        settings.getLanguage(),
        settings.getBackupEnabled(),
        settings.getBackupFrequencyCron(),
        settings.getHealingMessage(),
        settings.getPrintFooterNotes());
  }
}
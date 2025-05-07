package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.repository.ClinicSettingsRepo;
import clinic.dev.backend.service.ClinicSettingsServiceBase;

@Service
public class ClinicSettingsService implements ClinicSettingsServiceBase {

  @Autowired
  private ClinicSettingsRepo settingsRepository;

  @Override
  public ClinicSettings saveSettings(ClinicSettings settings) {
    return settingsRepository.save(settings);
  }

  @Override
  public ClinicSettings getSettings() {
    return settingsRepository.findAll().stream().findFirst().orElse(null);
  }

  @Override
  public ClinicSettings updateSettings(Long id, ClinicSettings updatedSettings) {
    ClinicSettings existing = settingsRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Settings not found with ID: " + id));

    // Update fields manually (or use a mapper)
    existing.setDoctorId(updatedSettings.getDoctorId());
    existing.setDoctorName(updatedSettings.getDoctorName());
    existing.setDoctorTitle(updatedSettings.getDoctorTitle());
    existing.setDoctorQualification(updatedSettings.getDoctorQualification());
    existing.setClinicAddress(updatedSettings.getClinicAddress());
    existing.setClinicPhoneNumber(updatedSettings.getClinicPhoneNumber());
    existing.setClinicEmail(updatedSettings.getClinicEmail());
    existing.setWorkingHours(updatedSettings.getWorkingHours());
    existing.setBackupDbPath(updatedSettings.getBackupDbPath());
    existing.setBackupImagesPath(updatedSettings.getBackupImagesPath());
    existing.setWorkingHours(updatedSettings.getWorkingHours());
    existing.setPrescriptionLogoPath(updatedSettings.getPrescriptionLogoPath());
    existing.setPhoneSupportsWhatsapp(updatedSettings.getPhoneSupportsWhatsapp());
    existing.setBackupEnabled(updatedSettings.getBackupEnabled());
    existing.setHealingMessage(updatedSettings.getHealingMessage());
    existing.setPrintFooterNotes(updatedSettings.getPrintFooterNotes());
    existing.setLanguage(updatedSettings.getLanguage());

    return settingsRepository.save(existing);
  }
}

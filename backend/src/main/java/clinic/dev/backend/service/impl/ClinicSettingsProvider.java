package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.repository.ClinicSettingsRepo;

@Service
public class ClinicSettingsProvider {

  private final ClinicSettingsRepo repository;

  @Value("${backup.sqlite.path}")
  private String defaultBackupDbPath;

  @Value("${backup.images.path}")
  private String defaultBackupImagesPath;

  @Autowired
  public ClinicSettingsProvider(ClinicSettingsRepo repository) {
    this.repository = repository;
  }

  public ClinicSettings getEffectiveSettings() {
    ClinicSettings settings = repository.findTopByOrderByIdDesc();
    if (settings == null) {
      settings = new ClinicSettings(); // Avoid NPE
    }

    if (isNullOrEmpty(settings.getBackupDbPath())) {
      settings.setBackupDbPath(defaultBackupDbPath);
    }
    if (isNullOrEmpty(settings.getBackupImagesPath())) {
      settings.setBackupImagesPath(defaultBackupImagesPath);
    }

    return settings;
  }

  private boolean isNullOrEmpty(String s) {
    return s == null || s.trim().isEmpty();
  }
}

package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import clinic.dev.backend.model.ClinicSettings;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BackupService {

  @Value("${spring.datasource.url}")
  private String sqliteDbPath;

  @Value("${backup.sqlite.path}")
  private String sqliteBackupPath;

  @Value("${file.upload-dir}")
  private String imagesFolderPath;

  @Value("${backup.images.path}")
  private String imagesBackupPath;

  private final ClinicSettingsProvider settingsProvider;

  @Autowired
  public BackupService(ClinicSettingsProvider settingsProvider) {
    this.settingsProvider = settingsProvider;
  }

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

  // @Scheduled(cron = "0 0 0 * * 4") // Runs every Thursday at 12:00 AM
  // @Scheduled(fixedDelay = 300000) // Runs every 5 minutes (300,000 ms)
  @Scheduled(cron = "0 0 0 * * *") // Runs every day at 12:00 AM
  public void performBackup() {
    try {
      ClinicSettings settings = settingsProvider.getEffectiveSettings();

      backupDatabase(settings);
      backupImages(settings);
      System.out.println("Backup completed successfully.");
    } catch (Exception e) {
      System.err.println("Backup failed: " + e.getMessage());
    }
  }

  private void backupDatabase(ClinicSettings settings) throws IOException {
    String timestamp = LocalDateTime.now().format(FORMATTER);
    String backupFile = sqliteBackupPath.replace(".sqlite", "_" + timestamp + ".sqlite");

    String dbFilePath = sqliteDbPath.replace("jdbc:sqlite:", "");
    Path source = Paths.get(dbFilePath);
    Path destination = Paths.get(settings.getBackupDbPath());

    Files.createDirectories(destination.getParent());
    Files.copy(source, destination, StandardCopyOption.REPLACE_EXISTING);

    System.out.println("Database backup saved to: " + backupFile);
  }

  private void backupImages(ClinicSettings settings) throws IOException {
    String timestamp = LocalDateTime.now().format(FORMATTER);
    Path source = Paths.get(imagesFolderPath);
    // Path destination = Paths.get(imagesBackupPath + "_" + timestamp);
    Path destination = Paths.get(settings.getBackupImagesPath() + "_" + timestamp);

    Files.createDirectories(destination);

    Files.walk(source)
        .forEach(sourcePath -> {
          Path targetPath = destination.resolve(source.relativize(sourcePath));
          try {
            if (Files.isDirectory(sourcePath)) {
              Files.createDirectories(targetPath);
            } else {
              Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
          } catch (IOException e) {
            System.err.println("Error copying file: " + sourcePath);
          }
        });

    System.out.println("Images backup saved to: " + destination);
  }
}

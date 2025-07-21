package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import clinic.dev.backend.service.FileStorageService;
import clinic.dev.backend.exceptions.FileStorageException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Profile("dev")
public class LocalStorageService implements FileStorageService {

  @Value("${file.upload-dir}")
  private String uploadDir;

  @Override
  public String storeFile(MultipartFile file, String folderPath) {
    try {
      Path uploadPath = Paths.get(uploadDir, folderPath);
      Files.createDirectories(uploadPath);

      String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
      Path filePath = uploadPath.resolve(fileName);

      Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
      return filePath.toString();
    } catch (Exception e) {
      throw new FileStorageException("Could not store file.", e);
    }
  }

  @Override
  public void deleteFile(String filePath) {
    try {
      Path path = Paths.get(filePath).toAbsolutePath().normalize();
      Files.deleteIfExists(path);
    } catch (IOException ex) {
      throw new FileStorageException("Could not delete file: " + filePath, ex);
    }
  }
}
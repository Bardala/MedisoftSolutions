package clinic.dev.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
  public String storeFile(MultipartFile file, String folderPath);

  public void deleteFile(String fileUrl);
}

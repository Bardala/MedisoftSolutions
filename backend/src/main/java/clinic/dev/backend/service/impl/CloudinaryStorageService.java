package clinic.dev.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import clinic.dev.backend.exceptions.FileStorageException;
import clinic.dev.backend.service.FileStorageService;

import java.io.IOException;
import java.util.Map;

@Service
@Profile("prod")
public class CloudinaryStorageService implements FileStorageService {

  private final Cloudinary cloudinary;

  @Autowired
  public CloudinaryStorageService(Cloudinary cloudinary) {
    this.cloudinary = cloudinary;
  }

  public String storeFile(MultipartFile file, String folderPath) {
    try {
      Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
          ObjectUtils.asMap(
              "folder", folderPath,
              "resource_type", "auto"));
      return (String) uploadResult.get("secure_url");
    } catch (IOException e) {
      throw new FileStorageException("Could not upload file to Cloudinary", e);
    }
  }

  public void deleteFile(String fileUrl) {
    try {
      // Extract public ID from URL
      String publicId = extractPublicIdFromUrl(fileUrl);
      cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    } catch (IOException e) {
      throw new FileStorageException("Could not delete file from Cloudinary", e);
    }
  }

  private String extractPublicIdFromUrl(String url) {
    // Cloudinary URL format:
    // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<version>/<public_id>.<format>
    String[] parts = url.split("/");
    int versionIndex = parts.length - 2;
    int publicIdIndex = parts.length - 1;

    // Remove file extension
    String publicIdWithExtension = parts[publicIdIndex];
    String publicId = publicIdWithExtension.split("\\.")[0];

    // Reconstruct full public ID with folder path
    StringBuilder fullPublicId = new StringBuilder();
    for (int i = 7; i < versionIndex; i++) { // Start after resource_type/type/version
      fullPublicId.append(parts[i]).append("/");
    }
    fullPublicId.append(publicId);

    return fullPublicId.toString();
  }
}
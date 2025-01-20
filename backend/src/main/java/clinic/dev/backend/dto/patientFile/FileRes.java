package clinic.dev.backend.dto.patientFile;

import java.time.LocalDateTime;

import org.springframework.core.io.Resource;

import lombok.Data;

@Data
public class FileRes {
  private Long patientId;
  private LocalDateTime createdAt;
  private String fileType;
  private Resource file;
}

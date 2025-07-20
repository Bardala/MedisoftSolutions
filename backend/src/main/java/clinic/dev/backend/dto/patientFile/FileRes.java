package clinic.dev.backend.dto.patientFile;

import java.time.Instant;

import org.springframework.core.io.Resource;

import lombok.Data;

@Data
public class FileRes {
  private Long patientId;
  private Instant createdAt;
  private String fileType;
  private Resource file;
}

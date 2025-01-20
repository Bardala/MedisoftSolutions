package clinic.dev.backend.dto.patientFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientFileRes {
  private Long id;
  private String fileType;
  private String description;
  private String filePath;
}

package clinic.dev.backend.dto.auth;

import clinic.dev.backend.model.enums.UserRole;
import lombok.Data;

@Data
public class CurrUserInfo {
  private Long id;
  private String username;
  private UserRole role;
  private String phone;
  private String name;
  private Long clinicId;
}

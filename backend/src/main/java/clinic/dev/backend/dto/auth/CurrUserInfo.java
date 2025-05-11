package clinic.dev.backend.dto.auth;

import lombok.Data;

@Data
public class CurrUserInfo {
  private Long id;
  private String username;
  private String role;
  private String phone;
  private String name;
  private Long clinicId;
}

package clinic.dev.backend.dto;

import lombok.Data;

@Data
public class CurrUserInfo {
  private Long id;
  private String username;
  private String role;
  private String phone;
  private String fullName;
}

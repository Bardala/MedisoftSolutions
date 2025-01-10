package clinic.dev.backend.dto.user;

import lombok.Data;

@Data
public class ResetPasswordRequest {
  private String username;
  private String newPassword;
}
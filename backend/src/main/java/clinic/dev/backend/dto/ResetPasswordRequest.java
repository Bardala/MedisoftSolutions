package clinic.dev.backend.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
  private String username;
  private String newPassword;
}
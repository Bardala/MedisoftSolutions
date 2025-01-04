package clinic.dev.backend.dto;

import clinic.dev.backend.constants.ErrorMsg;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupRequest {

  @NotBlank(message = ErrorMsg.USERNAME_IS_REQUIRED)
  private String username;

  @NotBlank(message = ErrorMsg.PASSWORD_IS_REQUIRED)
  private String password;

  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  private String role;

  public SignupRequest() {
  }
}

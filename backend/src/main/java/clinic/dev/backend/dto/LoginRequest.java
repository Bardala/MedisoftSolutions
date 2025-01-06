package clinic.dev.backend.dto;

import clinic.dev.backend.constants.ErrorMsg;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
  /** Can be either username or phone */
  @NotBlank(message = ErrorMsg.USERNAME_OR_PHONE_MUST_NOT_BE_NULL)
  private String identifier;

  @NotBlank(message = ErrorMsg.PASSWORD_MUST_NOT_BE_NULL)
  private String password;
}
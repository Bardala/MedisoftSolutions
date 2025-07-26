package clinic.dev.backend.dto.auth;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.model.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
  @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces")
  @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
  @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Only letters, numbers, dots, underscores and hyphens allowed")
  @NotBlank(message = ErrorMsg.USERNAME_IS_REQUIRED)
  private String username;

  @NotBlank(message = ErrorMsg.PASSWORD_IS_REQUIRED)
  private String password;

  // @RoleConstraint(message = "Invalid role. Allowed roles are 'Admin', 'Doctor'
  // and 'Assistant'")
  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  private UserRole role;

  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  private String name;

  @Pattern(regexp = "^0\\d{9,14}$", message = "Phone must start with 0 and be 10-15 digits")
  @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  private String phone;

  @NotNull(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK)
  private Long clinicId;
}

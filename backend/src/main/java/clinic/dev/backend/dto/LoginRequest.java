package clinic.dev.backend.dto;

import clinic.dev.backend.constants.ErrorMsg;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
  @NotBlank(message = ErrorMsg.USERNAME_MUST_NOT_BE_NULL)
  private String username;

  @NotBlank(message = ErrorMsg.PASSWORD_MUST_NOT_BE_NULL)
  private String password;

  public LoginRequest() {
  }

  public LoginRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}

package clinic.dev.backend.dto.auth;

public class LoginResponse extends SigninResponse {

  public LoginResponse(String token, String username) {
    super(token, username);
  }

}

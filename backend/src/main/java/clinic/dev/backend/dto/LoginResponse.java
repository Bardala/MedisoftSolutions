package clinic.dev.backend.dto;

public class LoginResponse extends SigninResponse {

  public LoginResponse(String token, String username) {
    super(token, username);
  }

}

package clinic.dev.backend.dto.auth;

public class SignupResponse extends SigninResponse {

  public SignupResponse(String token, String username) {
    super(token, username);
  }

}

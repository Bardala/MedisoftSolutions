package clinic.dev.backend.service;

import org.springframework.security.core.AuthenticationException;

public interface AuthServiceBase {
  String login(String username, String password) throws AuthenticationException;
}
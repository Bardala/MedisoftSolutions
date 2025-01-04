package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.service.AuthServiceBase;
import clinic.dev.backend.util.JwtUtil;

@Service
public class AuthService implements AuthServiceBase {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private JwtUtil jwtUtil;

  @Override
  public String login(String username, String password) throws AuthenticationException {
    try {
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
      UserDetails user = userDetailsService.loadUserByUsername(username);
      return jwtUtil.generateToken(user.getUsername());
    } catch (UsernameNotFoundException ex) {
      throw new AuthenticationException(ErrorMsg.USER_DOES_NOT_EXIST) {
      };
    } catch (BadCredentialsException ex) {
      throw new AuthenticationException(ErrorMsg.INVALID_USERNAME_OR_PASSWORD) {
      };
    } catch (AuthenticationException ex) {
      throw new AuthenticationException(ErrorMsg.AUTHENTICATION_FAILED) {
      };
    }
  }
}

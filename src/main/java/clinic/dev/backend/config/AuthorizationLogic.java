package clinic.dev.backend.config;

import org.springframework.stereotype.Component;

import clinic.dev.backend.util.AuthContext;

@Component("auth")
public class AuthorizationLogic {
  private final AuthContext authContext;

  public AuthorizationLogic(AuthContext authContext) {
    this.authContext = authContext;
  }

  public boolean isSuperAdmin() {
    return authContext.isSuperAdmin();
  }

  public boolean isOwner() {
    return authContext.isOwner();
  }

  public boolean isDoctor() {
    return authContext.isDoctor();
  }

  public boolean isAssistant() {
    return authContext.isAssistant();
  }

  public boolean hasAdminAccessToClinic(Long clinicId) {
    return authContext.hasAdminAccessToClinic(clinicId);
  }
}
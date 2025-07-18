package clinic.dev.backend.util;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import clinic.dev.backend.model.User.UserRole;

@Component
@RequestScope
@Data
public class AuthContext {
  private Long clinicId;
  private Long userId;
  private String username;
  private UserRole role;

  public boolean hasAdminAccessToClinic(Long clinicIdToCheck) {
    if (isSuperAdmin())
      return true;
    return clinicId != null && clinicId.equals(clinicIdToCheck) && isOwner();
  }

  public boolean isDoctor() {
    return UserRole.DOCTOR.equals(role);
  }

  public boolean isAssistant() {
    return UserRole.ASSISTANT.equals(role);
  }

  public boolean isOwner() {
    return UserRole.OWNER.equals(role);
  }

  public boolean isSuperAdmin() {
    return UserRole.SUPER_ADMIN.equals(role);
  }
}
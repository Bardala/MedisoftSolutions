package clinic.dev.backend.util;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Data
public class AuthContext {
  private Long clinicId;
  private Long userId;
  private String username;
  private String role;

  public boolean hasAdminAccessToClinic(Long clinicIdToCheck) {
    if (isSuperAdmin())
      return true;
    return clinicId != null && clinicId.equals(clinicIdToCheck) && isOwner();
  }

  public boolean isDoctor() {
    return "Doctor".equalsIgnoreCase(role);
  }

  public boolean isAssistant() {
    return "Assistant".equalsIgnoreCase(role);
  }

  public boolean isOwner() {
    return "Owner".equalsIgnoreCase(role);
  }

  public boolean isSuperAdmin() {
    return "SuperAdmin".equalsIgnoreCase(role);
  }
}
package clinic.dev.backend.util;

import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.repository.UserRepo;
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
  private String role; // This should be set during authentication

  private final UserRepo userRepository;

  public AuthContext(UserRepo userRepository) {
    this.userRepository = userRepository;
  }

  public boolean isSuperAdmin() {
    return "SuperAdmin".equalsIgnoreCase(role);
  }

  public boolean hasAdminAccessToClinic(Long clinicIdToCheck) {
    if (isSuperAdmin())
      return true; // Global access
    return clinicId != null && clinicId.equals(clinicIdToCheck) && isAdmin();
  }

  public void validateClinicAdminAccess() {
    if (!isAdmin()) {
      throw new UnauthorizedAccessException("Only Admin can perform this action");
    }
  }

  public void validateSuperAdminAccess() {
    if (!isSuperAdmin()) {
      throw new UnauthorizedAccessException("Only Super Admin can perform this action");
    }
  }

  public void validateAdminOrDoctorAccess() {
    if (!isAdmin() && !isDoctor()) {
      throw new UnauthorizedAccessException("Access denied");
    }
  }

  // Optional: More granular role checks
  public boolean isDoctor() {
    return "Doctor".equalsIgnoreCase(role);
  }

  public boolean isAssistant() {
    return "Assistant".equalsIgnoreCase(role);
  }

  public boolean isAdmin() {
    return "Admin".equalsIgnoreCase(role);
  }
}

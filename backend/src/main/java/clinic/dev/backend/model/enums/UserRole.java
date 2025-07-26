package clinic.dev.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
  OWNER("Owner"),
  DOCTOR("Doctor"),
  ASSISTANT("Assistant"),
  SUPER_ADMIN("SuperAdmin");

  private final String displayName;

  UserRole(String displayName) {
    this.displayName = displayName;
  }

  @JsonValue
  public String getDisplayName() {
    return displayName;
  }

  @JsonCreator
  public static UserRole fromString(String roleName) {
    if (roleName == null)
      return null;
    for (UserRole role : values()) {
      if (role.displayName.equalsIgnoreCase(roleName)) {
        return role;
      }
    }
    throw new IllegalArgumentException("No enum constant for role: " + roleName);
  }
}

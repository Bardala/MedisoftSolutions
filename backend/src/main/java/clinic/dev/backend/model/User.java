package clinic.dev.backend.model;

import java.time.Instant;
import java.util.Collection;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import clinic.dev.backend.constants.ErrorMsg;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_phone", columnList = "phone"),
    @Index(name = "idx_clinic_role", columnList = "clinic_id, role") // For common queries
})
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

  public User(Long id) {
    this.id = id;
  };

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "clinic_id", nullable = true) // SuperAdmin can have null
  private Clinic clinic;

  @NotBlank
  @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces")
  @Column(unique = true, nullable = false, updatable = false)
  @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
  @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Only letters, numbers, dots, underscores and hyphens allowed")
  private String username;

  @NotBlank(message = ErrorMsg.PASSWORD_IS_REQUIRED)
  @Column(nullable = false, length = 100)
  private String password;

  @NotBlank(message = ErrorMsg.FULLNAME_IS_REQUIRED)
  @Column(nullable = false, length = 100)
  private String name;

  @NotBlank(message = ErrorMsg.PHONE_IS_REQUIRED)
  @Column(unique = true, nullable = false, length = 20)
  private String phone;

  @NotNull
  // @RoleConstraint(message = "Invalid role. Allowed roles are 'SuperAdmin',
  // 'Owner', 'Doctor' and 'Assistant'")
  @Column(nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private UserRole role; // e.g., 'Doctor', 'Assistant', 'Admin', 'SuperAdmin'

  @Column(nullable = true, length = 512) // URL/path storage
  private String profilePicture;

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private Instant createdAt;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return null;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true; // Implement logic if needed
  }

  @Override
  public boolean isAccountNonLocked() {
    return true; // Implement logic if needed
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true; // Implement logic if needed
  }

  @Override
  public boolean isEnabled() {
    return true; // Implement logic if needed
  }

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

}
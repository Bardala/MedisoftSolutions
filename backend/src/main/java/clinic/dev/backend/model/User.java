package clinic.dev.backend.model;

import java.time.LocalDateTime;
import java.util.Collection;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.validation.RoleConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_phone", columnList = "phone")
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
  private String password;

  @NotBlank(message = ErrorMsg.FULLNAME_IS_REQUIRED)
  @Column(nullable = false)
  private String name;

  @NotBlank(message = ErrorMsg.PHONE_IS_REQUIRED)
  @Column(unique = true, nullable = false)
  private String phone;

  @NotNull
  @RoleConstraint(message = "Invalid role. Allowed roles are 'SuperAdmin', 'Owner', 'Doctor' and 'Assistant'")
  // @Enumerated(EnumType.STRING)
  private String role; // e.g., 'Doctor', 'Assistant', 'Admin', 'SuperAdmin'

  @Column(nullable = true)
  private String profilePicture;

  @Column(nullable = false, updatable = false, name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;

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

    public String getDisplayName() {
      return displayName;
    }

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
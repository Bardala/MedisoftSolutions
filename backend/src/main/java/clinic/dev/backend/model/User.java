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
import lombok.Data;

@Entity
@Data
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_phone", columnList = "phone")
})
public class User implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces")
  @Column(unique = true, nullable = false)
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
  @RoleConstraint(message = "Invalid role. Allowed roles are 'Doctor' and 'Assistant'")
  private String role; // e.g., 'Doctor', 'Assistant'

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
}
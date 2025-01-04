package clinic.dev.backend.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import clinic.dev.backend.validation.RoleConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class User implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces")
  @Column(unique = true, nullable = false)
  private String username;

  @NotBlank
  private String password;

  @NotNull
  @RoleConstraint(message = "Invalid role. Allowed roles are 'Doctor' and 'Assistant'")
  private String role; // e.g., 'Doctor', 'Assistant'

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return null; // Implement this method to return the user's authorities
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
